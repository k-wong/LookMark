'use strict';
const _ = require('lodash');
const async = require('async');
const ig = require('instagram-node').instagram();
const Mark = require('../models/Mark.js');

/**
 * GET /look
 * Returns all marks sorted by distance
 */
exports.getMarks = (req, res) => {
  res.render('look/index', {
    title: 'Look > Index'
  });
};



/**
 * GET /api/instagram
 * Instagram API example.
 */
exports.getInstagram = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'instagram');
  ig.use({ client_id: process.env.INSTAGRAM_ID, client_secret: process.env.INSTAGRAM_SECRET });
  ig.use({ access_token: token.accessToken });
  async.parallel({
    searchByUsername: (done) => {
      ig.user_search('taeyeon', (err, users) => {
        done(err, users);
      });
    },
    searchByUserId: (done) => {
      ig.user('1279594285', (err, user) => {
        done(err, user);
      });
    },
    myRecentMedia: (done) => {
      ig.user_self_media_recent((err, medias) => {
        done(err, medias);
      });
    }
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('api/instagram', {
      title: 'Instagram API',
      usernames: results.searchByUsername,
      userById: results.searchByUserId,
      myRecentMedia: results.myRecentMedia
    });
  });
};