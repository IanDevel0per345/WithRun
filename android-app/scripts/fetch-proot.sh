#!/usr/bin/env bash
# Downloads Termux's aarch64 proot build and stages it as jniLibs so Android lets the app execute it.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
out="$here/app/src/main/jniLibs/arm64-v8a"
base="https://packages.termux.dev/apt/termux-main"
work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
index="$(curl -fsSL "$base/dists/stable/main/binary-aarch64/Packages")"
mkdir -p "$out"
for pkg in proot libtalloc libandroid-shmem; do
  file="$(awk -v n="$pkg" '$0=="Package: "n{f=1} f&&/^Filename/{print $2; exit}' <<<"$index")"
  curl -fsSL "$base/$file" -o "$work/$pkg.deb"
  mkdir -p "$work/$pkg"; (cd "$work/$pkg" && ar x ../$pkg.deb && tar xf data.tar.*)
done
u=data/data/com.termux/files/usr
cp "$work/proot/$u/bin/proot"            "$out/libproot.so"
cp "$work/proot/$u/libexec/proot/loader" "$out/libproot-loader.so"
cp "$work/libtalloc/$u/lib/libtalloc.so.2.5.0" "$out/libtalloc.so"
cp "$work/libandroid-shmem/$u/lib/libandroid-shmem.so" "$out/libandroid-shmem.so"
chmod 755 "$out"/*.so
ls -l "$out"
