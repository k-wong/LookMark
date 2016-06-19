const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  instagram_id: String, //id
  name: String,
  latitude: Number,
  longitude: Number,

  //media: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}]
  medias: Array
}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;