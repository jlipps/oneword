#!/usr/bin/env node
"use strict";

var stdin = process.openStdin();

var data = "";

stdin.on('data', function(chunk) {
  data += chunk;
});

stdin.on('end', function() {
  data = data.trim();
  var re = new RegExp(/mongodb:\/\/([^:]+):([^@]+)@(.+)$/);
  var match = re.exec(data);
  if (match) {
    var username = match[1];
    var pw = match[2];
    var host = match[3];
    console.log(host + " -u " + username + " -p " + pw);
  } else {
    process.stderr.write("Could not match on " + data + "\n");
    process.exit(1);
  }
});
