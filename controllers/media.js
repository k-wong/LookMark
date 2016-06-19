'use strict';
const _ = require('lodash');
const async = require('async');
const Media = require('../models/Media.js');

exports.allMedias = (req, res) => {
  Media.find((err, docs) => {
    res.render('look/medias', { medias: docs });
  });
};

