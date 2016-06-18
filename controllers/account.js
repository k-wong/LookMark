'use strict';
const _ = require('lodash');
const async = require('async');
const ig = require('instagram-node').instagram();
const Account = require('../models/Account.js');


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
      }, (err, results) => {
        if (err) { return next(err); }
        console.log("Num user data:" + results.userData.length);
      });
    };


    res.render('look/follows', {
      title: 'Follows',
      allFollows: results.allFollows
    });
  });
};

/**
 * POST /account
 * Create a new local account.
 */
exports.createAccount = (req, res, next) => {
  const acct = new Account({


  });
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  Account.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};
