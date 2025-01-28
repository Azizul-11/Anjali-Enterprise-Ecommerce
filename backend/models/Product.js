const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number, 
  description: String,
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  featured: Boolean,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  features: [String],
  documents: [
    {
      name: String,
      url: String
    }
  ],
  video: String,
  videoUrl: { type: String } // Add this field
});

module.exports = mongoose.model('Product', productSchema);