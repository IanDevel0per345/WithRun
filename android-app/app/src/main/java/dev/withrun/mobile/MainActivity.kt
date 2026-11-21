package dev.withrun.mobile

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private val main = Handler(Looper.getMainLooper())
    private lateinit var logView: TextView
    private lateinit var scroll: ScrollView
    private var web: WebView? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        logView = TextView(this).apply { setPadding(32, 48, 32, 32); textSize = 12f; typeface = android.graphics.Typeface.MONOSPACE }
        scroll = ScrollView(this).apply { addView(logView) }
        setContentView(scroll)
        if (Build.VERSION.SDK_INT >= 33) requestPermissions(arrayOf("android.permission.POST_NOTIFICATIONS"), 0)

        Status.listener = { message, ready ->
            main.post { if (ready) showWeb() else if (web == null) append(message) }
        }
        begin()
    }

    private fun begin() {
        val paths = Paths(this)
        if (!paths.proot.exists()) {
            append("proot is missing from this build. Run scripts/fetch-proot.sh and rebuild.")
            return
        }
        Thread {
            val installer = Installer(this, paths) { line -> main.post { append(line) } }
            try {
                if (!installer.isInstalled()) installer.run()
                startForegroundService(Intent(this, RuntimeService::class.java))
            } catch (e: Exception) {
                main.post { append("Setup failed: ${e.message}") }
            }
        }.start()
    }

    private fun append(line: String) {
        logView.append(line + "\n")
        if (logView.lineCount > 400) logView.text = logView.text.toString().lines().takeLast(300).joinToString("\n")
        scroll.post { scroll.fullScroll(ScrollView.FOCUS_DOWN) }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun showWeb() {
        if (web != null) return
        web = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            webViewClient = WebViewClient()
            loadUrl("http://127.0.0.1:$SERVER_PORT/")
        }
        setContentView(web)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (web?.canGoBack() == true) web?.goBack() else super.onBackPressed()
    }

    override fun onDestroy() { Status.listener = null; super.onDestroy() }
}
