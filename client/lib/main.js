/*global Meteor:true, Accounts:true, Session:true, Deps:true */
"use strict";

Deps.autorun(function() {
  Meteor.subscribe("words");
});

