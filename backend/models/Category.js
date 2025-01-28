const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isSubcategory: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Category', categorySchema);