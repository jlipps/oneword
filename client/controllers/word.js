/*global Template:true, Meteor:true, Words:true, $:true, Helpers:true,
   window:true */
"use strict";

Meteor.loginVisitor();
var userId = Meteor.userId();

Template.word.myWord = function() {
  var curWord = Words.findOne({owner: userId});
  return curWord ? curWord.word : null;
};

var setWord = function(evt) {
  evt.preventDefault();
  $('#loaderBg').show();
  $('#loader').show();
  var wordText = $('#word').val().trim();
  var newWord = {word: wordText};
  var curWord = Words.findOne({owner: userId});
  var onErr = function() {
    window.alert("Sorry, there was a problem saving your word. Please make " +
                 "sure there are no spaces or characters other than a-z");
    $('#loaderBg').hide();
    $('#loader').hide();
  };
  var onSuccess = function() {
    $('#word').blur();
    $('#check').fadeIn(700, function() {
      setTimeout(function() {
        $('#check').fadeOut(700);
      }, 2000);
    });
    $('#submitWordForm').val(wordText);
    $('#loaderBg').hide();
    $('#loader').hide();
  };
  if (curWord) {
    Words.update(curWord._id, {$set: {word: wordText}}, function(err) {
      if (err) return onErr();
      onSuccess();
    });
  } else {
    Words.insert(newWord, function(err) {
      if (err) return onErr();
      onSuccess();
    });
  }
  return false;
};

Template.word.events({
  'submit #wordForm': setWord
});

Template.word.rendered = function() {
  $('#word').css({background: Words.getRandColor()});
  $('#submitWordForm').css({background: Words.getRandColor()});
};
