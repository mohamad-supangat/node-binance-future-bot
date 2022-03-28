#!/usr/bin/env bash
HEIGHT=15
WIDTH=40
CHOICE_HEIGHT=4
BACKTITLE="Sepetit asal stabil"
TITLE="Bismilah sukses"
MENU="Pilih bot yang akan di jalankan"

OPTIONS=(1 "Crypto Signal Python Webhook"
         2 "Tradingview Rest Web Server"
         3 "Loop ccxt macd"
         4 "Trading view scanner axios"
         5 "tradingview_api.js")

CHOICE=$(dialog --clear \
                --backtitle "$BACKTITLE" \
                --title "$TITLE" \
                --menu "$MENU" \
                $HEIGHT $WIDTH $CHOICE_HEIGHT \
                "${OPTIONS[@]}" \
                2>&1 >/dev/tty)

clear
case $CHOICE in
        1)
            tmuxp load "./tmuxp_script/CryptoSignalWebhook.yml"
            ;;
        2)
            tmuxp load "./tmuxp_script/TradingViewRest.yml"
            ;;
        3)
            tmuxp load "./tmuxp_script/LoopCCXTMacd.yml"
            ;;
        4)
            tmuxp load "./tmuxp_script/TradingViewScannerAxios.yml"
            ;;
        5)
            tmuxp load "./tmuxp_script/tradingview_api.yml"
            ;;

esac

