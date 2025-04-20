const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
