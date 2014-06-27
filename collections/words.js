/*global Meteor:true, Words:true, _:true */

/* structure:
 * {
 *   createdAt
 *   name
 *   owner (user id)
 *   members (list of user ids)
 *   invitationsUsed (list of invitation ids)
 *   goals (list of goal ids)
 * }
 */

Words = new Meteor.Collection("words");

Words.isValid = function(text) {
  console.log("Validating " + text);
  if (!/^[a-zA-Z]+$/.test(text)) {
    console.log("bad");
    return false;
  }
  return true;
};

Words.allow({
  insert: function(userId, word) {
    if (!Words.isValid(word.word)) {
      return false;
    }
    return Words.find({owner: userId}).count() === 0;
  },
  update: function(userId, word, fieldNames, mod) {
    if (!Words.isValid(mod.$set.word)) {
      return false;
    }
    return word.owner === userId;
  }
});

Words.randColors = ["#87C0D4", "#D2D2CA", "#C2C1E3", "#AFE0F9", "#FFC891", "#FFD782", "#F9B493", "#F7C7C7", "#ABCCC1", "#95CAB0", "#BEE4BD"];

Words.getRandColor = function() {
  var randColorIndex = Math.floor(Math.random() * Words.randColors.length);
  return Words.randColors[randColorIndex];
};

if (Meteor.isServer) {
  Words.before.insert(function(userId, word) {
    word.word = word.word.toLowerCase();
    word.createdAt = Date.now();
    word.owner = userId;
  });

  Words.before.update(function(userId, word, fieldNames, mod) {
    mod.$set.word = mod.$set.word.toLowerCase();
  });
}

