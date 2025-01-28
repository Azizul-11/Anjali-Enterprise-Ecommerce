import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImageIcon } from "lucide-react"; // For fallback icon
const apiUrl = import.meta.env.VITE_API_URL;

const OurCustomer = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/clients`);
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Clients
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Meet the clients who trust our work
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {clients.map((client) => (
              <div
                key={client.name}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="relative w-24 h-24 overflow-hidden flex items-center justify-center">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = null; // Placeholder
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <p className="mt-4 text-base font-medium text-gray-700">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCustomer;
