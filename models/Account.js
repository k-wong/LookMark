const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  instagram: String, //id
  full_Name: String,
  username: String,
  profile_picture: String,
  bio: String,
  posts: Number,
  follows: Number,
  followed_by: Number,

  marks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mark'}]
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
