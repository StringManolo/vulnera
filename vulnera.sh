#!/usr/bin/env bash


# If this script is run as vulnera command, go to .vulnera_folder
if [ -d ".vulnera_folder" ]; then
  cd ./.vulnera_folder
fi


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
            help|h|-h|--help)
                echo "Usage: vulnera [command] [server]"
                echo -e "\nexamples:" 
                echo "$ vulnera list"
                echo "$ vulnera start clickjacking"

                exit 0
                ;;
            *)
                echo "Unrecognized argument: $1"
                exit 1
                ;;
        esac
fi
