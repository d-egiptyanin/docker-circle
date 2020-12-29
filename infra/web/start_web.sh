#!/bin/bash

# Waiting redis
status=255
while [ $status -gt 0 ]; do
    echo Waiting redis
    sleep 2
    `2>/dev/null echo "" > /dev/tcp/$REDIS_HOST/6379 || exit 1`
    status=$?
done

sleep 10
python web.py
