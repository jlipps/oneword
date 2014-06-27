/*global Meteor:true, words:true, Invitations:true */
"use strict";

Meteor.publish("words", function() {
  words = words.find();
  return words;
});
