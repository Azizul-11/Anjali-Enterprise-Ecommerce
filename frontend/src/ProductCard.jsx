import React from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = '';

  // Safely decode token if present
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role || '';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">₹{product.price}</span>
          {userRole !== 'admin' && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click when clicking button
                addToCart(product);
              }} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;