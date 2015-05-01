// yawp.js

Challenges = new Mongo.Collection("challenges");
Objectives = new Mongo.Collection("objectives");

if (Meteor.isClient) {
  Template.body.events({
    "submit .new-challenge" : function (event) {
      var name = event.target.challengename.value;

      Meteor.call("addChallenge", name);

      event.target.challengename.value = "";  // Clears the form

      return false;                           // Prevents default form submit
    },
    "submit .new-objective" : function (event) {
      var name = event.target.text.value;

      Meteor.call("addObjective", name);

      event.target.text.value = "";           // Clears the form

      return false;                           // Prevents defaul form submit
    }
  });

  Template.body.helpers({
    challenges : function () {
      return Challenges.find();
    },
    objectives : function () {
      return Objectives.find();
    }
  });

  Template.challenge.events({
    "click .delete" : function () {
      Meteor.call("deleteChallenge", this._id);
    },
    "submit .new-objective" : function (event) {
      var name = event.target.text.value;
      var challengeId = event.target.challengeId.value;

      Meteor.call("addObjective", name, challengeId);

      event.target.text.value = "";           // Clears the form

      return false;                           // Prevents defaul form submit
    }
  });
  
  Template.challenge.helpers({
    objectives : function () {
      return Objectives.find({ challengeId : this._id });
    }
  });

  Template.objective.events({
    "click .delete" : function () {
      Meteor.call("deleteObjective", this._id);
    }
  });
  Template.objective.helpers({});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  addChallenge : function (name) {
    Challenges.insert({
      name : name,
      createdAt : new Date()
    });
  },
  deleteChallenge : function (challengeId) {
    var challenge = Challenges.findOne(challengeId);

    Challenges.remove(challenge);
  },
  addObjective : function (name, challengeId) {
    Objectives.insert({
      challengeId : challengeId,
      name : name,
      createdAt : new Date()
    });
  },
  deleteObjective : function (objectiveId) {
    var objective = Objectives.findOne(objectiveId);

    Objectives.remove(objective);
  }
});