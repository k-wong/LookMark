const User = require('../models/User');
const Account = require('../models/Account');
const Mark = require('../models/Mark');
const Media = require('../models/Media');

exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};


exports.cards = (req, res) => {
  Account.find({
    instagram_id: { $in: req.user.follows }
  })
  .populate('Mark')
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
    var k;
    console.log(docs2.length);
    for (k=0;k<docs2.length; ++k) {
      console.log(docs2[k].instagram_id);
    }
  res.render('home', {title: "Home", marks: docs2});
  }); // end Mark find
  }); // end Account find
}; // end function

exports.map = (req, res) => {
  Account.find({
  	instagram_id: { $in: req.user.follows }
  })
  .populate('Mark')
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
    var k;
    console.log(docs2.length);
    for (k=0;k<docs2.length; ++k) {
      console.log(docs2[k].instagram_id);
    }
	res.render('map', {marks: docs2});
  }); // end Mark find
  }); // end Account find
}; // end function