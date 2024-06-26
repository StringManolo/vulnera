#!/usr/bin/env bash

# Check if node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Install it and try again"
    exit
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "NPM is not installed. Install it and try again"
    exit
fi

if ! command -v git &> /dev/null
then
    echo "Git is not installed. Install it and try again"
    exit
fi

# install node modules
echo 'Installing servers node modules...'
npm install

echo -e "\n\nInstalling vulnera..."

# install vulnera

SCRIPT_DIR=$(pwd)
if [ -d "/data/data/com.termux" ]; then
  echo 'Termux detected, installing in termux'
  cp ./vulnera.sh /data/data/com.termux/files/usr/bin/vulnera
  echo 'Bin created at /data/data/com.termux/files/usr/bin/vulnera'
  chmod 775 /data/data/com.termux/usr/bin/vulnera
  echo 'Permissions set'
  echo "$SCRIPT_DIR" > /data/data/com.termux/files/usr/bin/.vulnera_folder
  echo "Link to $SCRIPT_DIR created at /data/data/com.termux/usr/bin/.vulnera_folder"
  echo "Installed in termux. You can run $ vulnera help"
else
  echo 'Linux detected, installing in linux'
  cp vulnera.sh /bin/vulnera
  echo 'Bin created at /bin/vulnera'
  chmod 775 /bin/vulnera
  echo 'Permissions set'
  echo "$SCRIPT_DIR" > /bin/.vulnera_folder
  echo "Link to $SCRIPT_DIR created at /bin/.vulnera_folder"
  echo "Installed in linux. You can run $ vulnera help"
fi 

echo -e 'WARNING:\nDO NOT DELETE OR MOVE THIS FOLDER. IT WILL BE USED BY VULNERA TO RUN SERVERS, LOCATE MODULES, AND OTHER FILES.'
