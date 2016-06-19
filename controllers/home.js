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

  Account.find({
  	instagram_id: { $in: req.user.follows }
  })
  .populate('Mark')
  //.populate('Media')
  //.where('Account.instagram_id').in(req.user.follows)
  .exec(function(err,docs) {

  var i, j;
  var mark_list = [];
  for (i = 0; i < docs.length; ++i) {
  	for (j = 0; j < docs[i].marks.length; ++j) {
        mark_list.push(docs[i].marks[j]);  //Mark.findOne({instagram_id: docs[i].marks[j]}));
  	};
  }; // end for

  // Get object-level Marks
  Mark.find({
     _id: { $in: mark_list }  //fucking hacky as shit b/c uses objectId instead of instagram_id...but fuck it
  })
  .populate('Media')
  .exec(function(err,docs2) {
    console.log(docs2);
    console.log(docs2[25].medias2)
	res.render('map', {marks: docs2});
  }); // end Mark find

  }); // end Account find



}; // end function

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