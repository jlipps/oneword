/*global Template:true, Meteor:true, Words:true, $:true, Helpers:true*/
"use strict";

Meteor.loginVisitor();
var userId = Meteor.userId();

Template.word.myWord = function() {
  var curWord = Words.findOne({owner: userId});
  return curWord ? curWord.word : null;
};

var setWord = function(evt, tpt) {
  evt.preventDefault();
  var wordText = $('#word').val().trim();
  var newWord = {word: wordText};
  var curWord = Words.findOne({owner: userId});
  if (curWord) {
    Words.update(curWord._id, {$set: {word: wordText}}, function(err) {
      if (err) window.alert(err);
      else console.log('yes');
    });
  } else {
    Words.insert(newWord, function(err) {
      if (err) window.alert(err);
      else console.log('yes');
    });
  }
  return false;
};

Template.word.events({
  'submit #wordForm': setWord
});
