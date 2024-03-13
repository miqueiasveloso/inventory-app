const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

// Virtual for item's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
