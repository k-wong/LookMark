const User = require('../models/User');
const Account = require('../models/Account');
const Mark = require('../models/Mark');
const Media = require('../models/Media');

exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

/**
 * GET /
 * Home page.
 */
 /*
exports.map = (req, res) => {
	console.log(req.user.follows.length);
  res.render('map', {
    title: 'Map'
  });
};
*/

exports.map = (req, res) => {
  Mark.find({})
  .populate('Account')
  .where('Account.instagram_id').in(req.user.follows)
  .exec(function(err,docs) { 
    res.render('look/marks', { marks: docs });
  });
};

/*
  var acct_callback = function(obj) {

  }


  var user_callback = function (obj) {
    for ()
    Mark.find({}, function (err,)
    var counter2 = obj.length
    _.each()

  }

  Account.find({}, function (err, user){
    var counter = req.user.follows.length;
    _.each(acct, function(acctItem) {
      if (counter) {
        returnObject.list.push(acctItem);          
        // we decrease the counter until 
        // it's 0 and the callback gets called
        counter--;
      } else {
      // since the counter is 0
      // this means all the users have been inserted into the array
      user_callback(returnObject);
      }
    });
  }); 
*/