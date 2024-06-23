#!/usr/bin/env bash


if [ -f "/data/data/com.termux/files/usr/bin/.vulnera_folder" ]; then
  SCRIPT_DIR=$(cat /data/data/com.termux/files/usr/bin/.vulnera_folder)
elif [ -f "/bin/.vulnera_folder" ]; then
  SCRIPT_DIR=$(cat /bin/.vulnera_folder)
else
  SCRIPT_DIR=$(pwd)
fi

cd "$SCRIPT_DIR"

if [ $# -eq 0 ]; then
    echo "Usage: vulnera help"
fi

if [ $# -gt 0 ]; then
        case "$1" in
            list|--list)
                npm run
                shift 2
                ;;
            start|--start)
              npm run "$2" # $2 is the first argument after --start (server name)
                shift 2
                ;;
            update|--update)
              git pull && ./install.sh

            help|h|-h|--help)
                echo "Usage: vulnera [command] [server]"
                echo -e "\nexamples:" 
                echo "$ vulnera list"
                echo "$ vulnera start clickjacking"
                echo "$ vulnera update"

                exit 0
                ;;
            *)
                echo "Unrecognized argument: $1"
                exit 1
                ;;
        esac
fi
