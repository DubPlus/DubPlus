#!/bin/bash

git status | grep "src/" && $@ || echo "src not updated, skipping tasks"