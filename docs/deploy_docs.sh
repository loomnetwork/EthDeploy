#!/bin/bash

#npm install -g s3-copy

aglio -i index.apib  -o dist/index.html

s3cmd put dist/index.html s3://loomx.io/docs/index.html