import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const fetchSolutions = async () => {
  const response = await axios.get(`${apiUrl}/api/solutions`);
  return response.data;
};

export default fetchSolutions;