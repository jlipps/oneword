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

Words.allow({
  insert: function(userId, word) {
    if (!/[a-zA-Z]/.test(word)) {
      return false;
    }
    return Words.find({owner: userId}).count() === 0;
  },
  update: function(userId, word) {
    return word.owner === userId;
  }
});

if (Meteor.isServer) {

  Words.before.insert(function(userId, word) {
    word.createdAt = Date.now();
    word.owner = userId;
  });

}

