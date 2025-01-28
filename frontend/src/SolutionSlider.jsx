import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const SolutionSlider = () => {
  const [solutions, setSolutions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // React Router hook for navigation

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % solutions.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [solutions]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % solutions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + solutions.length) % solutions.length);
  };

  const handleImageClick = () => {
    navigate(`/products`); // Redirect to the product page with the solution ID
  };

  return (
    <div className="relative h-[600px] overflow-hidden mt-2">
      {/* Slider Container */}
      <div 
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {solutions.length > 0 ? (
          solutions.map((solution, index) => (
            <div 
              key={index}
              className="min-w-full h-full relative cursor-pointer"
              onClick={() => handleImageClick()} // Handle image click
            >
              <img 
                src={solution.image} 
                alt={solution.name}
                className="w-full h-full object-fill cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-white text-5xl font-bold mb-4">{solution.name}</h1>
                <p className="text-white text-xl">{solution.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No solutions available</p>
        )}
      </div>

      {/* Navigation Buttons */}
      {solutions.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default SolutionSlider;