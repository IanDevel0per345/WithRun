package dev.withrun.mobile

import android.content.Context
import android.system.Os
import java.io.File

const val SERVER_PORT = 8799

/** Locations of the proot binaries (shipped as jniLibs) and of the Linux root filesystem. */
class Paths(private val context: Context) {
    val nativeDir: File get() = File(context.applicationInfo.nativeLibraryDir)
    val proot: File get() = File(nativeDir, "libproot.so")
    val loader: File get() = File(nativeDir, "libproot-loader.so")
    val rootfs: File = File(context.filesDir, "rootfs")
    val libDir: File = File(context.filesDir, "lib")
    val tmpDir: File = File(context.filesDir, "tmp")
    val doneMarker: File = File(rootfs, "root/.withrun-installed")
    val logFile: File = File(context.filesDir, "runtime.log")

    /** DT_NEEDED names that cannot be shipped as lib*.so are linked here. */
    fun prepareLibs() {
        libDir.mkdirs(); tmpDir.mkdirs()
        val link = File(libDir, "libtalloc.so.2")
        if (!link.exists()) Os.symlink(File(nativeDir, "libtalloc.so").path, link.path)
    }
}

object Proot {
    /** A process running [command] inside the Linux root filesystem as a fake root user. */
    fun command(paths: Paths, command: String): ProcessBuilder {
        paths.prepareLibs()
        val args = listOf(
            paths.proot.path, "-0", "--link2symlink", "--kill-on-exit",
            "-r", paths.rootfs.path,
            "-b", "/dev", "-b", "/proc", "-b", "/sys",
            "-w", "/root",
            "/usr/bin/env", "-i",
            "HOME=/root", "TERM=xterm-256color", "LANG=C.UTF-8",
            "PATH=/opt/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "/bin/bash", "-lc", command,
        )
        return ProcessBuilder(args).redirectErrorStream(true).also {
            it.environment().apply {
                put("PROOT_LOADER", paths.loader.path)
                put("PROOT_TMP_DIR", paths.tmpDir.path)
                put("LD_LIBRARY_PATH", "${paths.libDir.path}:${paths.nativeDir.path}")
            }
        }
    }
}
