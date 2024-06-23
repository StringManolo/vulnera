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
    echo -e "Usage: \033[1;33mvulnera help\033[0m"
fi

if [ $# -gt 0 ]; then
  case "$1" in

    list|--list)
    # lists available servers and interpret colors
    cat "./server_list.txt" | while IFS= read -r line; do echo -e "$line"; done

    shift 2
  ;;

  exploit|--exploit)
    npm run "$2-exploit" # $2 is the first argument after --exploit (server name)
    shift 2
  ;;

  start|--start)
    npm run "$2" # $2 is the first argument after --start (server name)
    shift 2
  ;;

  code|--code)
    npm run "$2-code" # $2 is the first argument after --code (server name)
    shift 2
  ;;

  update|--update)
    git pull && ./install.sh
    shift 2
  ;;

  help|h|-h|--help)
    echo -e "Usage: \033[1;33mvulnera [command] [server]\033[0m"
    echo -e "\nexamples:"
    echo -e "$ \033[1;32mvulnera list\033[0m                        # lists available servers"
    echo -e "$ \033[1;32mvulnera start clickjacking\033[0m          # starts clickjacking server"
    echo -e "$ \033[1;32mvulnera code clickjacking\033[0m           # shows code for clickjacking server"
    echo -e "$ \033[1;32mvulnera exploit clickjacking\033[0m        # shows exploit for clickjacking server"
    echo -e "$ \033[1;32mvulnera update\033[0m"
    echo -e "$ \033[1;32mvulnera help\033[0m                        # shows this help message"

    exit 0
  ;;


  *)
    echo -e "\033[1;31mUnrecognized argument: $1\033[0m"
    exit 1
  ;;
  
  esac
fi
