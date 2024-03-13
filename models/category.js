const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 }
});

// Virtual for category's URL
CategorySchema
.virtual('url')
.get(function () {
  return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
