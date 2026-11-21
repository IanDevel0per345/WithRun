package dev.withrun.mobile

import android.content.Context
import android.system.Os
import java.io.BufferedInputStream
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.zip.GZIPInputStream
import org.apache.commons.compress.archivers.tar.TarArchiveEntry
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream

/** First-run setup: download an Ubuntu arm64 root filesystem, then install Node and OpenMausBot inside it. */
class Installer(private val context: Context, private val paths: Paths, private val log: (String) -> Unit) {
    fun isInstalled() = paths.doneMarker.exists()

    fun run() {
        if (!File(paths.rootfs, "usr/bin/bash").exists()) {
            val archive = File(context.cacheDir, "rootfs.tar.gz")
            download(ROOTFS_URL, archive)
            log("Extracting Linux (this takes a few minutes)...")
            extract(archive, paths.rootfs)
            archive.delete()
        }
        File(paths.rootfs, "etc/resolv.conf").apply { parentFile?.mkdirs(); writeText("nameserver 1.1.1.1\nnameserver 8.8.8.8\n") }
        File(paths.rootfs, "root").mkdirs()
        val script = context.assets.open("install.sh").bufferedReader().readText()
        log("Installing Node.js and OpenMausBot inside Linux...")
        val code = stream(Proot.command(paths, script))
        check(code == 0 && paths.doneMarker.exists()) { "install failed (exit $code)" }
        log("Install finished.")
    }

    private fun stream(builder: ProcessBuilder): Int {
        val process = builder.start()
        process.inputStream.bufferedReader().forEachLine(log)
        return process.waitFor()
    }

    private fun download(url: String, target: File) {
        if (target.exists() && target.length() > 0) return
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.connect()
        val total = connection.contentLengthLong
        var done = 0L
        var lastPercent = -1
        val partial = File(target.path + ".part")
        connection.inputStream.use { input ->
            partial.outputStream().use { out ->
                val buffer = ByteArray(64 * 1024)
                while (true) {
                    val n = input.read(buffer)
                    if (n < 0) break
                    out.write(buffer, 0, n); done += n
                    val percent = if (total > 0) (done * 100 / total).toInt() else 0
                    if (percent != lastPercent) { lastPercent = percent; log("Downloading Linux: $percent%") }
                }
            }
        }
        check(partial.renameTo(target)) { "could not move download" }
    }

    private fun extract(archive: File, into: File) {
        into.mkdirs()
        val base = into.canonicalPath
        TarArchiveInputStream(GZIPInputStream(BufferedInputStream(archive.inputStream(), 1 shl 16))).use { tar ->
            while (true) {
                val entry: TarArchiveEntry = tar.nextTarEntry ?: break
                val target = File(into, entry.name)
                require(target.canonicalPath.startsWith(base)) { "unsafe path ${entry.name}" }
                when {
                    entry.isDirectory -> { target.mkdirs(); Os.chmod(target.path, 0b111_101_101) }
                    entry.isSymbolicLink -> {
                        target.parentFile?.mkdirs(); target.delete()
                        Os.symlink(entry.linkName, target.path)
                    }
                    entry.isLink -> {
                        target.parentFile?.mkdirs(); target.delete()
                        File(into, entry.linkName).copyTo(target, overwrite = true)
                    }
                    entry.isFile -> {
                        target.parentFile?.mkdirs()
                        target.outputStream().use { tar.copyTo(it) }
                        Os.chmod(target.path, entry.mode or 0b110_000_000)
                    }
                }
            }
        }
    }

    companion object {
        const val ROOTFS_URL =
            "https://cdimage.ubuntu.com/ubuntu-base/releases/24.04/release/ubuntu-base-24.04.5-base-arm64.tar.gz"
    }
}
