const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  instagram_id: String, //id
  full_name: String,
  username: String,
  profile_picture: String,
  bio: String,
  posts: Number,
  follows: Number,
  followed_by: Number,
  //marks: [String]
  marks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mark'}]
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
