const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { auth, admin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://anjalienterprise.org',
  credentials: true
}));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));
app.use('/documents', express.static(path.join(__dirname, '../frontend/public/documents')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const productRoutes = require('./routes/products');
const solutionRoutes = require('./routes/solutions');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const testimonialRoutes = require('./routes/testimonials'); // Import testimonials route
const clientRoutes = require('./routes/clients'); // Import clients route

app.use('/api/products', productRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/testimonials', testimonialRoutes); // Use testimonials route
app.use('/api/clients', clientRoutes); // Use clients route

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});