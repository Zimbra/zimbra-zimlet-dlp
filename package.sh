#!/bin/bash

npm install
zimlet build
zimlet package -v 0.0.2 --zimbraXVersion ">=4.0.0" -n "zimbra-zimlet-dlp" --desc "This Zimlet offers data loss prevention based on Presidio. It warns the user when sending sensitive information like credit card or social security number." -l "DLP Zimlet"
