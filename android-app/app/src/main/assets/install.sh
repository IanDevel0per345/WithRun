#!/bin/bash
# Runs once inside the Ubuntu root filesystem, under proot.
set -e
export DEBIAN_FRONTEND=noninteractive
echo "apt: updating package lists"
apt-get update -o APT::Sandbox::User=root
apt-get install -y --no-install-recommends -o APT::Sandbox::User=root \
  ca-certificates curl git xz-utils python3 make g++ procps

NODE_VERSION="${NODE_VERSION:-v24.22.3}"
if [ ! -x /opt/node/bin/node ]; then
  echo "Installing Node $NODE_VERSION"
  mkdir -p /opt/node
  curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-arm64.tar.xz" | tar -xJ -C /opt/node --strip-components=1
fi
export PATH=/opt/node/bin:$PATH

echo "Installing OpenMausBot"
npm install -g openmausbot

cat > /root/start.sh <<'START'
#!/bin/bash
export PATH=/opt/node/bin:$PATH
mkdir -p /root/openmausbot
cd /root/openmausbot
exec openmausbot serve --no-pair
START
chmod +x /root/start.sh
touch /root/.withrun-installed
echo "done"
