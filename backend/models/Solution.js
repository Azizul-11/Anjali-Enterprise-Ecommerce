const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model('Solution', solutionSchema);