'use strict';
const _ = require('lodash');
const async = require('async');
const ig = require('instagram-node').instagram();
const User = require('../models/User');
const Account = require('../models/Account.js');
const Mark = require('../models/Mark.js');
const Media = require('../models/Media.js');

/**
Get all accounts in db; testing only
*/
exports.allAccounts = (req, res) => {
  Account.find((err, docs) => {
    res.render('look/index', { accounts: docs });
  });
};


/**
 * GET /update
 * Update follows
 */
exports.getFollows = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'instagram');
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });

  async.parallel({
    allFollows: (done) => {
      ig.user_follows(req.user.instagram, (err, users, remaining, limit) => {
        done(err, users);
      });
    }
  }, (err, results) => {
    if (err) { return next(err); }
    console.log("User -- # of follows : " + results.allFollows.length);
    var index, min_id;

    for (index = 0; index < results.allFollows.length; ++index) {
      async.parallel({
        userData: (done) => {
          ig.user(results.allFollows[index].id, (err, users, remaining, limit) => {
            done(err, users);
          });
        }
      }, (err, results2) => {
        if (err) { return next(err); }
        console.log("  Account -- " + results2.userData.username);
        // Add account if doesn't exist
        const acct = new Account({
          instagram_id: results2.userData.id,
          username: results2.userData.username,
          full_name: results2.userData.full_name,
          profile_picture: results2.userData.profile_picture,
          bio: results2.userData.bio,
          posts: results2.userData.counts.media,
          follows: results2.userData.counts.follows,
          followed_by: results2.userData.counts.followed_by,
          marks: []
        });
        var temp_marks = []; //for keeping track of Mark IDs to add to Account

        // Get marks and media for this account
        // [do-while result set = 20 then keep paging]
        async.parallel({
          recentMedia: (done) => {
            ig.user_media_recent(acct.instagram_id, (err, medias, pagination, remaining, limit) => {
              done(err, medias);
            });
          }
        }, (err, results3) => {
          if (err) { return next(err); }

          // Loop through this set of recent media and create Marks and Medias as appropriate
          var i;
          for (i = 0; i < results3.recentMedia.length; ++i) {
            console.log(results3.recentMedia[i].location == null);
            if (results3.recentMedia[i].location != null) { // only proceed if there's a location tag
              console.log("    " + i + " Mark -- " + results3.recentMedia[i].location.name);
              const mark = new Mark({
                instagram_id: results3.recentMedia[i].location.id,
                name: results3.recentMedia[i].location.name,
                latitude: results3.recentMedia[i].location.latitude,
                longitude: results3.recentMedia[i].location.longitude,
                //accts_been: [],
                medias: [], //{results3.recentMedia[i].id})
                medias2:[]
              });
              //console.log("    " + i + " Mark -- " + temp_marks.toString());
              console.log("      " + i + " Media -- " + results3.recentMedia[i].caption.text);  
              const media = new Media({
                instagram_id: results3.recentMedia[i].id, //id
                likes: results3.recentMedia[i].likes.count,
                comments: results3.recentMedia[i].comments.count,
                ig_link: results3.recentMedia[i].link,
                caption: results3.recentMedia[i].caption.text,
                post_date: results3.recentMedia[i].created_time,
                image_url: results3.recentMedia[i].images.standard_resolution.url,
                posted_by_instagram_id: results3.recentMedia[i].user.id,
                posted_by_name: results3.recentMedia[i].user.full_name
              });

              const test = {
                instagram_id: results3.recentMedia[i].id, //id
                likes: results3.recentMedia[i].likes.count,
                comments: results3.recentMedia[i].comments.count,
                ig_link: results3.recentMedia[i].link,
                caption: results3.recentMedia[i].caption.text,
                post_date: results3.recentMedia[i].created_time,
                image_url: results3.recentMedia[i].images.standard_resolution.url,
                posted_by_instagram_id: results3.recentMedia[i].user.id,
                posted_by_name: results3.recentMedia[i].user.full_name
              };

              Mark.findOne({ instagram_id: mark.instagram_id }, (err, existingMark) => {
                if (!existingMark) { // add new mark
                  mark.medias.push(media);
                  mark.medias2.push(test);

                  //mark.medias.push(media.instagram_id);
                  mark.save((err) => {
                    if (err) { return next(err); }
                  });
                  console.log("    Mark - New Added");
                  temp_marks.push(mark); // add into temp Marks list
                } else { // if existing Mark, then just add the additional Media
                  var k;
                  var flag;
                  for (k = 0; k < existingMark.medias.length; ++k) {
                    if (existingMark.medias[k].instagram_id = mark.instagram_id) {
                      flag = true;
                    }
                  }; // end for
                  if (!flag) { //if not previously existing media then add
                    //existingMark.medias.push(media.instagram_id);
                    existingMark.medias.push(media);
                    existingMark.medias2.push(test);
                  };
                  existingMark.save((err) => {
                    if (err) { return next(err); }
                  });

                  temp_marks.push(existingMark); // add into temp Marks list
                };
              }); // end Mark add


              Media.findOne({ instagram_id: media.instagram_id }, (err, existingMedia) => {
                if (!existingMedia) {
                  media.save((err) => {
                    if (err) { return next(err); }
                  });
                  console.log("      Media - New Added");
                }
              }); // end Media add
            }; // end if  
          }; // end for

        Account.findOne({ instagram_id: acct.instagram_id }, (err, existingAcct) => {
          if (!existingAcct) { //new account
            var j;
            for (j = 0; j < temp_marks.length; ++j) {
              acct.marks.push(temp_marks[j]);
            }
            acct.save((err) => {
              if (err) { return next(err); }
              console.log("SAVED NEW ACCT: " + acct.marks.toString())
            });
          } else { //if Account exists, check for any updates to Marks
            var j, k, flag;
            for (j = 0; j < temp_marks.length; ++j) {
              flag = false;
              for (k = 0; k < existingAcct.marks.length; ++k) {
                if (!temp_marks[k] == null) {
                  if (temp_marks[k].instagram_id = existingAcct.marks[j].instagram_id) {
                    flag = true;
                  }
                }
              } // end for
              if (!flag) { // this temp_mark item doesn't exist in existingAcct
                existingAcct.marks.push(temp_marks[j])
              }
            } // end for
            existingAcct.save((err) => {
              if (err) { return next(err); }
              console.log("SAVED EXI ACCT: " + acct.marks.toString())
            });
          } // end if

        });
        // End getting marks and media

          // Update follows list of the current user
          User.findById(req.user.id, (err, user) => {
            if (err) { return next(err); }
            if (user.follows.indexOf(acct.instagram_id) < 0) {
              console.log("Before: " + user.follows);
              user.follows.push(acct.instagram_id);
              console.log("After: " + user.follows);
            }

            user.save((err) => {
              if (err) { return next(err); }
            });
          });
          
        }); // end findOne
      }); // end userdata return
      
      // End
      

    }; // end for

    console.log("Outside of for");
    res.render('look/follows', {
      title: 'Follows',
      allFollows: results.allFollows
    });
  });
};
