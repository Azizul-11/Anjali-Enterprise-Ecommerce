import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${VITE_API_URL}/api/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Customer Reviews
        </h2>
        
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((testimonial) => (
              <div key={testimonial._id} 
                   className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} 
                            className={`text-xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.review}</p>
                <p className="text-sm text-gray-400 mt-4">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;