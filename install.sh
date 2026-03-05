#!/bin/sh
set -e

go build -o justshowmediff .
mv justshowmediff /usr/local/bin/
echo "Installed \033[32mjustshowmediff\033[0m to /usr/local/bin/"
