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
      return Challenges.find();
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
  Template.challenge.events({});
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
      console.log(event);
      var key = event.target.name;
      var val = event.target.value;
      var objective = event.target.closest('.update-objective').objective.value;
      console.log(objective);

      Meteor.call("updateObjective", this._id, key, val, objective);
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
  updateObjective : function (objectiveId, key, value, obj) {
    var objective = Objectives.findOne(objectiveId);
    var keyval = {};
    keyval[key] = value;
    keyval["objective"] = obj;
    console.log(keyval);
    Objectives.update(
      objective,
      { 
        $set : keyval,
        $currentDate : { 
          modifiedAt : { $type : "date" }
        }
      }
    );
  },
  deleteObjective : function (objectiveId) {
    var objective = Objectives.findOne(objectiveId);

    Objectives.remove(objective);
  }
});