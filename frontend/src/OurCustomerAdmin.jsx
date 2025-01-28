import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const OurCustomerAdmin = ({ token }) => {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !logo) {
      setError('Name and logo are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('logo', logo);

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/clients`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setClients([...clients, response.data]);
      setName('');
      setLogo(null);
      setError('');
    } catch (error) {
      setError('Error uploading client');
      console.error('Error uploading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await axios.delete(`${apiUrl}/api/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted client from state
      setClients(clients.filter(client => client._id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Clients</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700">Client Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Client Logo</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Add Client'}
        </button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client) => (
          <div key={client._id} className="bg-white p-4 rounded-lg shadow">
            <img src={client.logo} alt={client.name} className="h-16 w-auto mx-auto mb-2" />
            <p className="text-center">{client.name}</p>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => handleDeleteClient(client._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCustomerAdmin;