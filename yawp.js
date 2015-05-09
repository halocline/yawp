// yawp.js


/* MongoDB Models */
Challenges = new Mongo.Collection("challenges");
Objectives = new Mongo.Collection("objectives");

/* Routes using iron:router */
Router.map(function () {
  this.route('home', {
    path : '/'
  });
  this.route('challenge', {
    path : '/challenge/:id',
    data : function () {
      var id = this.params.id;
      return Challenges.findOne(id);
    }
  });
  this.route('challenges');
});

//
//
/* Client scripts */
//
//
if (Meteor.isClient) {
  Template.body.events({});
  Template.body.helpers({});

  /* challenges */
  Template.challenges.events({
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

  Template.challenges.helpers({
    challenges : function () {
      return Challenges.find(
        {},
        {sort: {name: 1}}
      );
    },
    objectives : function () {
      return Objectives.find();
    }
  });

  /* challengeItem */
  Template.challengeItem.events({
    "click .delete" : function () {
      Meteor.call("deleteChallenge", this._id);
    },
    "submit .new-objective" : function (event) {
      var objective = event.target.objective.value;
      var challengeId = event.target.challengeId.value;

      Meteor.call("addObjective", objective, challengeId);

      event.target.text.value = "";           // Clears the form

      return false;                           // Prevents defaul form submit
    }
  });
  
  Template.challengeItem.helpers({
    objectives : function () {
      return Objectives.find({ challengeId : this._id });
    }
  });

  /* challenge */
  Template.challenge.events({
    "change .challenge-detail" : function (event) {
      var key = event.target.name;
      var val = event.target.value;

      Meteor.call("updateChallenge", this._id, key, val);
    }
  });
  Template.challenge.helpers({
    objectives : function () {
      return Objectives.find({ challengeId : this._id });
    }
  });

  /* objective */
  Template.objective.events({
    "click .delete" : function () {
      Meteor.call("deleteObjective", this._id);
    }
  });
  Template.objective.helpers({});

  /* objectiveCard */
  Template.objectiveCard.events({
    "change .objectiveVal" : function (event) {
      var key = event.target.name;
      var val = event.target.value;

      Meteor.call("updateObjective", this._id, key, val);
    }
  });
  Template.objectiveCard.helpers({});
}

//
//
/* Server scripts */
//
//
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

//
//
/* Meteor scripts */
//
//
Meteor.methods({
  addChallenge : function (name) {
    Challenges.insert({
      name : name,
      createdAt : new Date()
    });
  },
  updateChallenge : function (challengeId, key, value) {
    var challenge = Challenges.findOne(challengeId);
    var keyval = {};
    keyval[key] = value;
    Challenges.update(
      challenge,
      {
        $set : keyval,
        $currentDate : {
          modifiedAt : true
        }
      }
    );
  },
  deleteChallenge : function (challengeId) {
    var challenge = Challenges.findOne(challengeId);

    Challenges.remove(challenge);
  },
  addObjective : function (objective, challengeId) {
    Objectives.insert({
      challengeId : challengeId,
      objective : objective,
      createdAt : new Date()
    });
  },
  updateObjective : function (objectiveId, key, value) {
    var objective = Objectives.findOne(objectiveId);
    var keyval = {};
    keyval[key] = value;
    Objectives.update(
      objective,
      { 
        $set : keyval,
        $currentDate : { 
          modifiedAt : true
        }
      }
    );
    Meteor.call("setObjectiveName", objectiveId);
  },
  setObjectiveName : function (objectiveId) {
    var objective = Objectives.findOne(objectiveId);
    var val = objective.action + ' ' + objective.on + ' ' + objective.object;

    Objectives.update(
      objective,
      { $set : { "objective" : val } }
    );
  },
  deleteObjective : function (objectiveId) {
    var objective = Objectives.findOne(objectiveId);

    Objectives.remove(objective);
  }
});