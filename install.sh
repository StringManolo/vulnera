#!/usr/bin/env bash

# install node modules
npm install

SCRIPT_DIR=$(pwd)

if [ -d "/data/data/com.termux" ]; then
  cp ./vulnera.sh /data/data/com.termux/usr/bin/vulnera
  chmod 775 /data/data/com.termux/usr/bin/vulnera
  ln -s "$SCRIPT_DIR" "/data/data/com.termux/usr/bin/.vulnera_folder"
  echo "Installed in termux"
else
  cp vulnera.sh /bin/vulnera
  chmod 775 /bin/vulnera
  ln -s "$SCRIPT_DIR" "/usr/bin/.vulnera_folder"
  echo "Installed in linux"
fi 

