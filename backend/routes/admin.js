const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const Category = require('../models/Category');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'image' 
      ? path.join(__dirname, '../../frontend/public/uploads')
      : path.join(__dirname, '../../frontend/public/documents');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Add/Update product validation
const validateProduct = (req, res, next) => {
  const { name, price, description, category } = req.body;
  
  if (!name || !price || !description || !category) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  next();
};

router.post('/categories', auth, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products (admin only)
router.get('/products', auth, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new product (admin only)
router.post('/products', 
  auth, 
  admin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  validateProduct,
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        features: JSON.parse(req.body.features || '[]'),
        image: req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '',
        documents: req.files['documents'] 
          ? req.files['documents'].map(file => ({
              name: file.originalname,
              url: `/documents/${file.filename}`
            }))
          : []
      };

      const product = new Product(productData);
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: 'Error adding product', error: err.message });
    }
  }
);

// Update product (admin only)
router.put('/products/:id', 
  auth, 
  admin, 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  validateProduct,
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        price: Number(req.body.price),
        description: req.body.description,
        category: req.body.category,
        featured: req.body.featured === 'true',
        rating: Number(req.body.rating) || 0,
        reviews: Number(req.body.reviews) || 0,
        features: JSON.parse(req.body.features || '[]'),
        videoUrl: req.body.videoUrl || ''
      };

      // Handle image upload
      if (req.files && req.files['image']) {
        updateData.image = `/uploads/${req.files['image'][0].filename}`;
      }

      // Handle document uploads
      if (req.files && req.files['documents']) {
        const newDocuments = req.files['documents'].map(file => ({
          name: file.originalname,
          url: `/documents/${file.filename}`
        }));
        updateData.documents = [...newDocuments];
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ 
        message: 'Error updating product',
        error: err.message 
      });
    }
  }
);

// Delete product (admin only)
router.delete('/products/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (admin only)
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post('/categories', auth, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all categories (no auth required)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create subcategory
router.post('/subcategories', auth, admin, async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const subcategory = new Category({ 
      name, 
      parent: parentId,
      isSubcategory: true 
    });
    const newSubcategory = await subcategory.save();
    res.status(201).json(newSubcategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get subcategories for a category
router.get('/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const subcategories = await Category.find({ 
      parent: req.params.categoryId,
      isSubcategory: true 
    });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all main categories (non-subcategories)
router.get('/maincategories', async (req, res) => {
  try {
    const categories = await Category.find({ isSubcategory: false });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete category
router.delete('/categories/:id', auth, admin, async (req, res) => {
  try {
    // First delete all subcategories
    await Category.deleteMany({ parent: req.params.id });
    
    // Then delete the category
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category and related subcategories deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update category
router.put('/categories/:id', auth, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add this new route for deleting subcategories
router.delete('/subcategories/:id', auth, admin, async (req, res) => {
  try {
    const subcategory = await Category.findOneAndDelete({ 
      _id: req.params.id,
      isSubcategory: true 
    });
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    res.json({ message: 'Subcategory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;