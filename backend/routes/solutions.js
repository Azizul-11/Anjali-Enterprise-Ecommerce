const express = require('express');
const router = express.Router();
const Solution = require('../models/Solution');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all solutions
router.get('/', async (req, res) => {
  try {
    const solutions = await Solution.find();
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new solution
router.post('/', upload.single('image'), async (req, res) => {
  const { name } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const solution = new Solution({ name, image });
  try {
    console.log('Solution data:', solution); // Add this line to log the solution data
    const newSolution = await solution.save();
    res.status(201).json(newSolution);
  } catch (err) {
    console.error('Error saving solution:', err); // Add this line to log the error
    res.status(400).json({ message: err.message });
  }
});

// Delete a solution
router.delete('/:id', async (req, res) => {
  try {
    const solution = await Solution.findByIdAndDelete(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json({ message: 'Solution deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;