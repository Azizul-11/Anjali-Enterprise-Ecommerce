import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const Card = ({ product, addToCart }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    addToCart(product);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCardClick}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;