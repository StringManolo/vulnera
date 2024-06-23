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
    cat "./server_list.txt"
    shift 2
  ;;

  exploit|--exploit)
    npm run "$2"-exploit # $2 is the first argument after --exploit (server name)
    shift 2
  ;;

  start|--start)
    npm run "$2" # $2 is the first argument after --start (server name)
    shift 2
  ;;

  code|--code)
    npm run "$2"-code # $2 is the first argument after --code (server name)
    shift 2
  ;;

  update|--update)
    git pull && ./install.sh
    shift 2
  ;;

  help|h|-h|--help)
    echo "Usage: vulnera [command] [server]"
    echo -e "\nexamples:" 
    echo "$ vulnera list    # lists available servers"
    echo "$ vulnera start clickjacking    # starts clickjacking server"
    echo "$ vulnera code clickjacking   # shows code for clickjacking server"
    echo "$ vulnera exploit clickjacking    # shows exploit for clickjacking server"
    echo "$ vulnera update"
    echo "$ vulnera help    # shows this help message"

    exit 0
  ;;

  *)
    echo "Unrecognized argument: $1"
    exit 1
  ;;
  
  esac
fi
