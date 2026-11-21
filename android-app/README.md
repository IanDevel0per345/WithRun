# WithRun Mobile (Android)

Runs OpenMausBot entirely on the phone. On first launch the app downloads an
Ubuntu 24.04 arm64 root filesystem, starts it with proot (no root needed),
installs Node 24 and `openmausbot` inside it, then runs `openmausbot serve` and
shows the UI in a WebView at `http://127.0.0.1:8799`.

## Build

```sh
./scripts/fetch-proot.sh        # stages proot/talloc/loader into jniLibs (not committed)
ANDROID_HOME=/path/to/sdk gradle :app:assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk` (arm64-v8a only).

## Design notes

- `targetSdk = 28`: Android 10+ forbids executing files from the app data
  directory for newer targets, which proot needs. Sideload only; Google Play
  would reject this target.
- proot ships as `lib*.so` in `jniLibs` so Android installs it as an executable.
  `libtalloc.so.2` is symlinked at runtime from `libtalloc.so`.
- `RuntimeService` is a foreground service with a wake lock so Android does not
  kill the server. Exclude the app from battery optimization.

## Not done yet (untested on a device)

- Running on a real phone: the APK has only been compiled.
- Browser for the bots: needs a CDP backend backed by a WebView/GeckoView.
- Native Node modules (`@duckdb/node-api`, `@resvg/resvg-js`) under proot arm64.
- Engine sign-in (Claude/Codex CLIs) and API keys.
