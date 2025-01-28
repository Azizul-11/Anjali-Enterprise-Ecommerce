import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Import for safe token decoding
const apiUrl = import.meta.env.VITE_API_URL;

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  
  const token = localStorage.getItem('token');
  let userRole = '';

  // Safely decode the token if present
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role || '';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products/${id}`);
        setProduct(response.data);
        // Determine initial media type
        setMediaType(response.data.videoUrl || response.data.video ? 'video' : 'image');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);  // Pass both product and quantity
  };

  // Example media array - modify your backend to include video URLs
  const productMedia = [
    { type: 'image', url: product?.image },
    { type: 'video', url: product?.videoUrl }, // Add video URL in your product data
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === productMedia.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [productMedia.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === productMedia.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? productMedia.length - 1 : prev - 1
    );
  };

  const renderMedia = () => {
    if (!product) return null;

    if (mediaType === 'video') {
      if (product.videoUrl) {
        const embedUrl = product.videoUrl.replace('watch?v=', 'embed/');
        return (
          <iframe
            src={embedUrl}
            className="w-full h-full object-contain rounded-lg"
            allowFullScreen
          />
        );
      } else if (product.video) {
        return (
          <video
            src={product.video}
            className="w-full h-full object-contain rounded-lg"
            controls
            autoPlay
            muted
          />
        );
      }
    }

    return (
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-contain rounded-lg"
      />
    );
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Media Display */}
          <div className="md:w-1/2 h-[500px] relative">
            <div className="h-full p-4">
              {renderMedia()}
              
              {/* Media Toggle Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product?.image && (
                  <button
                    onClick={() => setMediaType('image')}
                    className={`px-4 py-2 rounded ${
                      mediaType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Image
                  </button>
                )}
                {(product?.videoUrl || product?.video) && (
                  <button
                    onClick={() => setMediaType('video')}
                    className={`px-4 py-2 rounded ${
                      mediaType === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Video
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-6">₹{product.price}</p>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Key Features:</h2>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Product Brochure:</h2>
              <div className="space-y-2">
                {product.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Video */}
            

            {/* Conditionally render the Add to Cart button */}
            {userRole !== 'admin' && (
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;