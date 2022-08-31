const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 300 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

// Virtual for item's URL
ItemSchema.virtual('url').get(function () {
  return '/item/' + this._id;
});

// Export model
module.exports = mongoose.model('Item', ItemSchema);
