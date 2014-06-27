/*global Template:true, Meteor:true, Words:true, $:true, _:true,
   window:true */
"use strict";
var requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;
Meteor.loginVisitor();
var userId = Meteor.userId();
console.log("You are " + userId);
var renderedWords = {};

var fontSizeForWord = function(count) {
  return 11 + (22 * Math.sqrt(count / 3));
};

var wordAdded = function(word) {
  console.log('adding word');
  if (_.has(renderedWords, word.word)) {
    renderedWords[word.word].count++;
    renderedWords[word.word].ids.push(word._id);
    updateWordElement(word.word, renderedWords[word.word].count);
  } else {
    renderedWords[word.word] = {
      count: 1,
      ids: [word._id]
    };
    addWordElement(word.word, 1);
  }
};

var addWordElement = function(word, count) {
  var el = $('<div class="word" id="word' + word + '">' + word + '</div>');
  el.css({
    fontSize: fontSizeForWord(count),
    position: 'absolute',
    top: '-1000px',
    left: '-1000px',
    color: Words.getRandColor()
  });
  $('#wordGround').append(el);
  randomizeElementPosition(el);
  animateElement(el);
};

var randomizeElementPosition = function(el) {
  var checkRectClear = function(x1, y1, x2, y2) {
    var foundOverlap = false;
    _.each(renderedWords, function (data, word) {
      if (!foundOverlap) {
        var el = $('#word' + word);
        var elW = el.outerWidth(), elH = el.outerHeight();
        var elX1 = el.position().left, elY1 = el.position().top;
        var elX2 = elX1 + elW, elY2 = elY1 + elH;
        var leftOverlap = elX1 >= x1 && elX1 <= x2;
        var topOverlap = elY1 >= y1 && elY1 <= y2;
        var bottomOverlap = elY2 >= y1 && elY2 <= y2;
        var rightOverlap = elX2 >= x1 && elX2 <= x2;
        var overlaps = (leftOverlap && (topOverlap || bottomOverlap)) ||
                       (rightOverlap && (topOverlap || bottomOverlap));
        if (overlaps) {
          foundOverlap = true;
        }
      }
    });
    return !foundOverlap;
  };

  var getRandPos = function() {
    var x = Math.floor(Math.random() * (maxX - p * 2) + p);
    var y = Math.floor(Math.random() * (maxY - p * 2) + p);
    return {x: x, y: y};
  };

  var elW = el.outerWidth();
  var elH = el.outerHeight();
  var screenW = $('#wordGround').outerWidth();
  var screenH = $('#wordGround').outerHeight();
  var maxX = screenW - elW;
  var maxY = screenH - elH;
  var p = 20;
  var randPos = getRandPos();
  while (!checkRectClear(randPos.x - p, randPos.y - p,
                         randPos.x + elW + p, randPos.y + elH + p)) {
    randPos = getRandPos();
  }
  el.css({top: randPos.y + 'px', left: randPos.x + 'px'});
};

var wordChanged = function(newWord, oldWord) {
  console.log('changing word');
  removeWordById(oldWord._id);
  console.log(renderedWords);
  wordAdded(newWord);
};

var updateWordElement = function(word, count) {
  var el = $('#word' + word);
  el.css({fontSize: fontSizeForWord(count)});
};

var wordRemoved = function(id) {
  removeWordById(id);
};

var removeWordElement = function(word) {
  var el = $('#word' + word);
  el.remove();
};

var findWordById = function(id) {
  console.log("finding word by id: " + id);
  var foundWord = null;
  _.each(renderedWords, function(data, word) {
    if (_.contains(data.ids, id)) {
      foundWord = word;
    }
  });
  console.log("found word: " + foundWord);
  return foundWord;
};

var removeWordById = function(id) {
  var word = findWordById(id);
  if (renderedWords[word].count > 1) {
    renderedWords[word].count--;
    renderedWords[word].ids = _.without(renderedWords[word].ids, id);
    updateWordElement(word, renderedWords[word].count);
  } else {
    removeWordElement(word);
    delete renderedWords[word];
  }
};

var animateElement = function(el) {
  var alpha = Math.random() * 2 * Math.PI;
  el.tails = [];
  var stepSize = Math.random() * 0.3 + 0.15;
  var p = 2;
  var inBounds = function() {
    var elX = el.position().left;
    var elY = el.position().top;
    var elW = el.outerWidth();
    var elH = el.outerHeight();
    var screenW = $('#wordGround').outerWidth();
    var screenH = $('#wordGround').outerHeight();
    return !((elX < p) || ((elX + elW) > (screenW - p)) ||
             (elY < p) || ((elY + elH) > (screenH - p)));
  };
  var step = function(timestamp) {
    if (el.parent().length) {
      var curX = el.position().left;
      var curY = el.position().top;
      var newX = curX + (stepSize * Math.cos(alpha));
      var newY = curY + (stepSize * Math.sin(alpha));
      el.css({
        left: newX,
        top: newY
      });
      if (!inBounds()) {
        alpha = Math.random() * 2 * Math.PI;
        stepSize = Math.random() * 0.3 + 0.15;
      }
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
};

Handlebars.registerHelper('key_value', function(context, options) {
  var result = [];
  _.each(context, function(value, key, list) {
    result.push({key:key, value:value});
  });
  return result;
});

Template.present.rendered = function() {
  var cursor = Words.find();
  cursor.observe({
    added: wordAdded,
    changed: wordChanged,
    removed: wordRemoved
  });
};
