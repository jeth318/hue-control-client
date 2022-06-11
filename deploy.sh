#!/bin/sh
branch=$(git branch --show-current)

if [[ $branch == "main" ]]; then
    echo "On main branch. Will build and ship to server"
    npm run build
    echo "Shipping dist to server"
    rsync -arvz -e 'ssh -p 2244' --progress $(pwd)/dist/* jeth@elara.local:/var/www/home-control
else
    echo "Not on main branch. Skipping build and deploy."
fi