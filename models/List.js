const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: String, //id
  isFavorite: boolean
  items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mark'}]

}, { timestamps: true });

const List = mongoose.model('List', listSchema);

module.exports = List;