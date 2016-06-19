const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  instagram_id: String, //id
  name: String,
  latitude: Number,
  longitude: Number,

//  accts_been: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
  medias: [{type: mongoose.Schema.Types.ObjectId, ref: 'Media'}],
  //medias: [String]

  medias2: [{
	instagram_id: String, //id
	likes: Number,
	comments: Number,
	ig_link: String,
	caption: String,
	post_date: Date,
	image_url: String,
	posted_by_instagram_id: String,
	posted_by_name: String,
	mark_instagram_id: String
  }] // because i can't get the normal embed method to work during finds

}, { timestamps: true });

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;