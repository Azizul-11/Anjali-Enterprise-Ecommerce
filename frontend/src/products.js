import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const fetchProducts = async () => {
  const response = await axios.get(`${apiUrl}/api/products`);
  return response.data;
};

export default fetchProducts;