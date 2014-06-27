/*global Meteor:true, words:true, Invitations:true */
"use strict";

Meteor.publish("words", function() {
  var words = Words.find();
  return words;
});
