'use strict';
const _ = require('lodash');
const async = require('async');
const Mark = require('../models/Mark.js');

exports.allMarks = (req, res) => {
  Mark.find((err, docs) => {
    res.render('look/marks', { marks: docs });
  });
};