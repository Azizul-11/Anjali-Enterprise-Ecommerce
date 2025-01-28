import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


const fetchFeaturedProducts = async () => {
  const response = await axios.get(`${apiUrl}/api/products/featured`);
  return response.data;
};

export default fetchFeaturedProducts;