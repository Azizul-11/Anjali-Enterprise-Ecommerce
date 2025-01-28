import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tag, ChevronRight, ShoppingCart, Search } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const subcategoryResponse = await axios.get(`${apiUrl}/api/admin/categories/${categoryId}/subcategories`);
        setSubcategories(subcategoryResponse.data);
      } catch (error) {
        console.error('Failed to fetch subcategories', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(`${apiUrl}/api/products`);
        const filteredProducts = productResponse.data.filter(product => product.category === categoryId);
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    fetchSubcategories();
    fetchProducts();
  }, [categoryId]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = (subcategoryId) => {
    return products.filter(
      (product) =>
        product.subcategory === subcategoryId &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= priceFilter.min &&
        product.price <= priceFilter.max
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center">
            <Tag className="mr-3 text-blue-600" size={32} />
            Category Products
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 hidden sm:block">Price:</label>
              <input
                type="number"
                placeholder="Min"
                value={priceFilter.min === 0 ? '' : priceFilter.min}
                onChange={(e) => setPriceFilter((prev) => ({ ...prev, min: Number(e.target.value) || 0 }))}
                className="w-20 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceFilter.max === Infinity ? '' : priceFilter.max}
                onChange={(e) => setPriceFilter((prev) => ({ ...prev, max: Number(e.target.value) || Infinity }))}
                className="w-20 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Subcategories and Products */}
        {subcategories.map((subcategory) => {
          const subcategoryProducts = filteredProducts(subcategory._id);

          return (
            <div key={subcategory._id} className="mb-8 sm:mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <ChevronRight className="mr-2 text-blue-500" size={20} />
                  {subcategory.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {subcategoryProducts.length} product{subcategoryProducts.length !== 1 ? 's' : ''}
                </span>
              </div>

              {subcategoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {subcategoryProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 sm:h-48 object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ShoppingCart size={20} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm sm:text-base font-semibold mb-2 text-gray-800">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-lg font-bold text-blue-600">₹{product.price}</span>
                          <span className="text-xs sm:text-sm text-gray-500 hover:text-blue-600">View Details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No products in this subcategory</p>
              )}
            </div>
          );
        })}

        {/* No Subcategories */}
        {subcategories.length === 0 && (
          <div className="text-center text-gray-500 py-10">No subcategories found for this category.</div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;
