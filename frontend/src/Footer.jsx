import React from 'react';
import { 
  
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            {/* About Us */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">About Us</h3>
              <p className="mb-4">
                Manufacturer and System Integrator of IoT based Smart Electrical & Electronic Control Panels and Robotic Systems and Servicing Company incorporated in 2014 and working in this domain since 10 years.
              </p>
              <p>
                Basic Electrical Lab, Electrical Machine Lab, Electrical Drives Lab, Power System Lab, Computer Lab, Electronics Engineering, Mechanical Engineering, Civil Engineering, Physics Lab, Chemistry Lab.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/terms" className="text-gray-500 hover:text-white transition-colors duration-200">Terms and Conditions</a>
                </li>
                <li>
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/refund" className="text-gray-500 hover:text-white transition-colors duration-200">Cancellation and Refund</a>
                </li>
                <li>
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/shipping" className="text-gray-500 hover:text-white transition-colors duration-200">Shipping and Delivery</a>
                </li>
                <li>
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/privacy" className="text-white hover:underline">Privacy Policy</a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                  <a href="https://goo.gl/maps/3Wp62rRqEE7wMEjA6" target="_blank" rel="noopener noreferrer">
                    <p>565, Natun Pally, Central Road, Purbapara, Sonarpur, Kolkata-700150, W.B.</p>
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <p>+91 - 9804955613, 8777012148</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <div>
                      <p>anjalienterprise2014@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </footer>
  );
};

export default Footer;