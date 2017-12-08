#!/usr/bin/env bash

docker build -t app-nodejs ./nodejs
docker run -d -e "SERVER_NAME=chicken" --name=chicken -v uploads:/srv/uploads app-nodejs
docker run -d -e "SERVER_NAME=steak" --name=steak -v uploads:/srv/uploads app-nodejs
docker run -d -e "SERVER_NAME=salmon" --name=salmon -v uploads:/srv/uploads app-nodejs

docker build -t app-nginx ./nginx
docker run -d -p 8080:80 --link chicken --link steak --link salmon --name balancer app-nginx
