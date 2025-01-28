// const mongoose = require('mongoose');
// const Product = require('./models/Product');
// const Solution = require('./models/Solution');
// const Cart = require('./models/Cart');

// mongoose.connect('mongodb://localhost/electronics-store', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', async () => {
//   console.log('Connected to MongoDB');

//   // Clear existing data
//   await Product.deleteMany({});
//   await Solution.deleteMany({});
//   await Cart.deleteMany({});

//   // Insert sample products
//   const products = await Product.insertMany([
//     {
//       name: "Smartphone",
//       price: 699,
//       description: "A high-end smartphone with a great camera.",
//       image: "smartphone.jpg",
//       category: "Electronics",
//       featured: true
//     },
//     {
//       name: "Laptop",
//       price: 999,
//       description: "A powerful laptop for all your needs.",
//       image: "laptop.jpg",
//       category: "Electronics",
//       featured: false
//     },
//     {
//       name: "Headphones",
//       price: 199,
//       description: "Noise-cancelling headphones for immersive sound.",
//       image: "headphones.jpg",
//       category: "Accessories",
//       featured: true
//     }
//   ]);

//   // Insert sample solutions
//   await Solution.insertMany([
//     {
//       name: "Home Security",
//       image: "home-security.jpg"
//     },
//     {
//       name: "Smart Home",
//       image: "smart-home.jpg"
//     }
//   ]);

//   // Insert sample cart
//   await Cart.create({
//     products: [
//       {
//         product: products[0]._id,
//         quantity: 1
//       },
//       {
//         product: products[1]._id,
//         quantity: 2
//       }
//     ]
//   });

//   console.log('Sample data inserted');
//   mongoose.connection.close();
// });

const mongoose = require('mongoose');
const Product = require('./models/Product');
const Solution = require('./models/Solution');
const Cart = require('./models/Cart');
const Category = require('./models/Category'); // Import Category model

mongoose.connect('mongodb://localhost/electronics-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Clear existing data
  await Product.deleteMany({});
  await Solution.deleteMany({});
  await Cart.deleteMany({});
  await Category.deleteMany({});

  // Create categories
  const electronicsCategory = await Category.create({ name: 'Electronics' });
  const accessoriesCategory = await Category.create({ name: 'Accessories' });

  // Insert sample products
  const products = await Product.insertMany([
    {
      name: "Smartphone",
      price: 699,
      description: "A high-end smartphone with a great camera.",
      image: "smartphone.jpg",
      category: electronicsCategory._id, // Use ObjectId
      featured: true,
    },
    {
      name: "Laptop",
      price: 999,
      description: "A powerful laptop for all your needs.",
      image: "laptop.jpg",
      category: electronicsCategory._id, // Use ObjectId
      featured: false,
    },
    {
      name: "Headphones",
      price: 199,
      description: "Noise-cancelling headphones for immersive sound.",
      image: "headphones.jpg",
      category: accessoriesCategory._id, // Use ObjectId
      featured: true,
    },
  ]);

  // Insert sample solutions
  await Solution.insertMany([
    {
      name: "Home Security",
      image: "home-security.jpg",
    },
    {
      name: "Smart Home",
      image: "smart-home.jpg",
    },
  ]);

  // Insert sample cart
  await Cart.create({
    products: [
      {
        product: products[0]._id,
        quantity: 1,
      },
      {
        product: products[1]._id,
        quantity: 2,
      },
    ],
  });

  console.log('Sample data inserted');
  mongoose.connection.close();
});
