const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  instagram_id: String, //id
  name: String,
  latitude: Number,
  longitude: Number,

//  accts_been: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
  medias: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}]
  //medias: [String]
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;