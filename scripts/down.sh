#!/usr/bin/env bash

docker stop balancer salmon steak chicken
docker rm $(docker ps -a -q)
