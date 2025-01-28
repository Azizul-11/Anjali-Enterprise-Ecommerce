import React, { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import TapanDas from "./assets/TapanDas.png";
import logo1 from "./assets/logo1.png"
import logo2 from "./assets/logo2.png"
import logo3 from "./assets/logo3.png"
import {
  Cpu,
  Zap,
  Wrench,
  GraduationCap,
  Server,
  Bot,
  Building2,
  Calendar,
  BarChart3,
  FileCode,
  Building,
  Factory,
} from "lucide-react";
import NavBar from "./NavBar";
import ShoppingCart from "./Shoppingcart";
import Footer from "./Footer";
import SolutionSlider from "./SolutionSlider";
import TestimonialSection from "./TestimonialSection";
import CheckoutPage from "./CheckoutPage";
import Card from "./Card";
import Login from "./Login";
import Signup from "./Signup";
import AdminPanel from "./AdminPanel";
import UserOrders from "./UserOrders";
import ProductDetails from "./ProductDetails";
import axios from "axios";
import ScrollToTop from "./ScrollToTop";
import ProductPage from "./ProductPage";
import SubcategoryPage from "./SubcategoryPage"; // Import the SubcategoryPage component
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import fetchFeaturedProducts from './featuredProducts';
import OurCustomer from './OurCustomer'; // Corrected import statement

// Add the new quick links
const quickLinks = [
  { name: "Terms and Conditions", url: "https://merchant.razorpay.com/policy/PkxnLXQOaL587H/terms" },
  { name: "Cancellation and Refund", url: "https://merchant.razorpay.com/policy/PkxnLXQOaL587H/refund" },
  { name: "Shipping and Delivery", url: "https://merchant.razorpay.com/policy/PkxnLXQOaL587H/shipping" },
];

function QuickLinks() {
  return (
    <div>
      {quickLinks.map((link, index) => (
        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
          {link.name}
        </a>
      ))}
    </div>
  );
}

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState("");

  // const navigate =useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserRole(decodedToken.role);
    } else {
      localStorage.removeItem("token");
      setUserRole("");
    }
  }, [token]);

  const addToCart = async (product) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCart(response.data.products);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access - redirect to login
        Navigate("/login");
      }
    }
  };

  const removeFromCart = async (productId) => {
    await axios.post(
      `${apiUrl}/api/cart/remove`,
      { productId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from being less than 1
    try {
      const response = await axios.post(
        `${apiUrl}/api/cart/update`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(response.data.products);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data?.products || []); // Handle null cart object
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Set cart to an empty array in case of error
    }
  };

  const fetchProducts = async () => {
    const response = await axios.get(`${apiUrl}/api/products`);
    setProducts(response.data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await fetchFeaturedProducts();
      setFeaturedProducts(products);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, [token]);

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-100 pt-20">
        <NavBar
          cartLength={cart.length}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setIsCartOpen={setIsCartOpen}
          setSearchQuery={setSearchQuery}
          setToken={setToken} // Pass setToken to NavBar
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SolutionSlider />
                <section className="py-12 bg-gray-50">
                  <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                      <h2 className="text-3xl font-bold mb-6">
                        Transforming Industries Since 2014
                      </h2>
                      <div className="flex flex-col items-center">
                        {/* Circular Image */}
                        <img
                          src={TapanDas}
                          alt="Tapan Das"
                          className="w-32 h-32 rounded-full object-cover shadow-md"
                        />
                        {/* Name and Title */}
                        <div className="mt-4">
                          <p className="text-lg font-semibold text-gray-800">
                            Mr. Tapan Das
                          </p>
                          <p className="text-sm text-gray-600">Founder</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg mt-2">
                        With over a decade of expertise, we specialize in
                        designing and delivering IoT-based Smart Electrical &
                        Electronic Control Panels, Robotic Systems, and
                        comprehensive servicing solutions.
                      </p>
                    </div>
                    {/* Company Details Card */}
                    <div className="max-w-4xl mx-auto bg-white shadow-xl border-0">
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-center text-blue-600 mb-8">
                          Welcome to Anjali Enterprise
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column */}
                          <div className="space-y-6">
                            <div className="flex items-start gap-3">
                              <Factory className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Nature of Business
                                </p>
                                <p className="text-gray-600">
                                  Manufacturer & Supplier
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Legal Status
                                </p>
                                <p className="text-gray-600">
                                  Proprietorship Company
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <FileCode className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  IEC Code
                                </p>
                                <p className="text-gray-600">ATYPD1595L</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-6">
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  GST Registration Date
                                </p>
                                <p className="text-gray-600">01-07-2017</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <BarChart3 className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Annual Turnover
                                </p>
                                <p className="text-gray-600">1 - 2.5Cr</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Building className="w-5 h-5 text-blue-600 mt-1" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  GST No.
                                </p>
                                <p className="text-gray-600">19ATYPD1595L1ZT</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logos and Final Text */}
                      <div className="px-8 pb-8 text-center">
                        {/* Logos */}
                        <div className="flex justify-center gap-7 mb-4">
                          <img
                            src={logo1} /* Replace with your first logo path */
                            alt="Logo 1"
                            className="w-16 h-16 object-contain"
                          />
                          <img
                            src={logo2} /* Replace with your second logo path */
                            alt="Logo 2"
                            className="w-16 h-16 object-contain"
                          />
                          <img
                            src={logo3} /* Replace with your third logo path */
                            alt="Logo 3"
                            className="w-16 h-16 object-contain"
                          />
                        </div>

                        {/* Final Text */}
                        <p className="text-gray-600">
                          Delivering comprehensive manufacturing excellence and
                          industrial solutions across India.
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 mt-5">
                      <div className="text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <Cpu className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Proven Expertise
                          </h3>
                          <p className="text-gray-600">
                            10+ years in IoT and smart system integration
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Innovation-Driven
                          </h3>
                          <p className="text-gray-600">
                            Cutting-edge technology solutions
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <Wrench className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Complete Support
                          </h3>
                          <p className="text-gray-600">
                            From design to delivery and servicing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Labs & Equipment */}
                <section className="py-20 bg-gray-50">
                  <Link to="/products">
                    <div className="container mx-auto px-4 cursor-pointer">
                      <h2 className="text-3xl font-bold text-center mb-12">
                        Labs & Equipment
                      </h2>
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <GraduationCap className="w-12 h-12 mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Educational Labs
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>Basic Electrical Lab</li>
                            <li>Electrical Machine Lab</li>
                            <li>Power System Lab</li>
                            <li>Computer Lab</li>
                          </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <Server className="w-12 h-12 mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Engineering Labs
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>Electronics Engineering Lab</li>
                            <li>Mechanical Engineering Lab</li>
                            <li>Civil Engineering Lab</li>
                            <li>Electrical Drives Lab</li>
                          </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <Bot className="w-12 h-12 mb-4 text-blue-600" />
                          <h3 className="text-xl font-semibold mb-2">
                            Science Labs
                          </h3>
                          <ul className="space-y-2 text-gray-600">
                            <li>Physics Lab</li>
                            <li>Chemistry Lab</li>
                            <li>Robotics Lab</li>
                            <li>IoT Lab</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>



                <section className="max-w-6xl mx-auto px-4 py-8">
                  <h2 className="text-3xl font-bold mb-8 text-center">
                    Featured Products
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                      <Card
                        key={product._id}
                        product={product}
                        addToCart={addToCart}
                      />
                    ))}
                  </div>
                </section>

                <OurCustomer />
                <TestimonialSection />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <ProductPage
                products={filteredProducts}
                addToCart={addToCart}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetails addToCart={addToCart} />}
          />
          <Route
            path="/checkout"
            element={
              token ? (
                <CheckoutPage
                  cart={cart}
                  calculateTotal={calculateTotal}
                  token={token}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/category/:categoryId" element={<SubcategoryPage />} /> {/* Add this route */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route
            path="/admin"
            element={
              token && userRole === 'admin' ? <AdminPanel token={token} /> : <Navigate to="/admin" />
            }
          />
          <Route
            path="/orders"
            element={
              token ? <UserOrders token={token} /> : <Navigate to="/login" />
            }
          />
        </Routes>
        {isCartOpen && (
          <ShoppingCart
            cartItems={cart}
            setIsCartOpen={setIsCartOpen}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateTotal={calculateTotal}
          />
        )}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
