'use strict';
const _ = require('lodash');
const async = require('async');
const ig = require('instagram-node').instagram();
const Account = require('../models/Account.js');

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
    console.log("Test : " + results.allFollows.length);
    
    var index;
    for (index = 0; index < results.allFollows.length; ++index) {
      console.log("Looping through follows: " + index);
      async.parallel({
        userData: (done) => {
          ig.user(results.allFollows[index].id, (err, users, remaining, limit) => {
            done(err, users);
          });
        }
      }, (err, results2) => {
        if (err) { return next(err); }
        
        // Add account if doesn't exist
        const acct = new Account({
          id: results2.userData.id,
          username: results2.userData.username,
          full_name: results2.userData.full_name,
          profile_picture: results2.userData.profile_picture,
          bio: results2.userData.bio,
          posts: results2.userData.counts.media,
          follows: results2.userData.counts.follows,
          followed_by: results2.userData.counts.followed_by
        });

        Account.findOne({ id: results2.userData.id }, (err, existingUser) => {
          if (existingUser) {

          } else {
            user.save((err) => {
              if (err) { return next(err); }
            });
          } // end if
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
