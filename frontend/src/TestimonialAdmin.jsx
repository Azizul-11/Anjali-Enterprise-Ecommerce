import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const TestimonialAdmin = ({ token }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ 
    name: '', 
    review: '', 
    rating: 5 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, [token]);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/testimonials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to fetch testimonials');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/testimonials`, 
        newTestimonial,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTestimonials(prev => [...prev, response.data]);
      setNewTestimonial({ name: '', review: '', rating: 0 });
      setError('');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      setError('Failed to add testimonial');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_URL}/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      setError('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold mb-4">Manage Testimonials</h3>
      
      <form onSubmit={handleAddTestimonial} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            name="name" 
            value={newTestimonial.name} 
            onChange={handleInputChange} 
            placeholder="Customer Name"
            required
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Review</label>
          <textarea 
            name="review" 
            value={newTestimonial.review} 
            onChange={handleInputChange} 
            placeholder="Customer Review"
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input 
            type="number" 
            name="rating" 
            value={newTestimonial.rating} 
            onChange={handleInputChange} 
            min={1}
            max={5}
            required
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Testimonial
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display existing testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {testimonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((testimonial) => (
          <div key={testimonial._id} 
               className="border p-4 rounded-lg bg-white shadow hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(testimonial._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600 mt-2">{testimonial.review}</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialAdmin;