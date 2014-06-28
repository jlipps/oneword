#!/bin/bash
set -e

params="$(meteor mongo oneword.meteor.com --url | ./get_prod_db.js)"
mongo $params
