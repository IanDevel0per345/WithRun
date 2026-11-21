package dev.withrun.mobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import java.net.InetSocketAddress
import java.net.Socket

/** Keeps Linux and the OpenMausBot server alive while the app is in the background. */
class RuntimeService : Service() {
    private var process: Process? = null
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, notification())
        wakeLock = (getSystemService(POWER_SERVICE) as PowerManager)
            .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "withrun:runtime").apply { acquire() }
        if (process?.isAlive != true) startServer()
        return START_STICKY
    }

    private fun startServer() {
        val paths = Paths(this)
        Thread {
            Status.post("Starting server...")
            val builder = Proot.command(paths, "cd /root/openmausbot && exec /root/start.sh")
            builder.redirectOutput(ProcessBuilder.Redirect.appendTo(paths.logFile))
            val started = builder.start().also { process = it }
            Status.post("Server process started.")
            while (started.isAlive) {
                if (reachable()) Status.ready() else Status.post("Waiting for server...")
                Thread.sleep(1500)
            }
            Status.post("Server stopped (exit ${started.exitValue()}). See runtime.log.")
        }.start()
    }

    private fun reachable() = try {
        Socket().use { it.connect(InetSocketAddress("127.0.0.1", SERVER_PORT), 500); true }
    } catch (_: Exception) { false }

    override fun onDestroy() {
        process?.destroy()
        wakeLock?.release()
        super.onDestroy()
    }

    private fun notification(): Notification {
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            manager.createNotificationChannel(NotificationChannel("runtime", "Runtime", NotificationManager.IMPORTANCE_LOW))
        }
        return Notification.Builder(this, "runtime")
            .setContentTitle("WithRun is running")
            .setContentText("Linux and the OpenMausBot server are active")
            .setSmallIcon(android.R.drawable.ic_menu_manage)
            .build()
    }
}

/** Process-wide status the activity observes. */
object Status {
    @Volatile var listener: ((String, Boolean) -> Unit)? = null
    @Volatile var isReady = false
    fun post(message: String) { isReady = false; listener?.invoke(message, false) }
    fun ready() { isReady = true; listener?.invoke("ready", true) }
}
