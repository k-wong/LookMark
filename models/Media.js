const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
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
//  _mark: {type: mongoose.Schema.Types.ObjectId, ref: 'Mark'}
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;