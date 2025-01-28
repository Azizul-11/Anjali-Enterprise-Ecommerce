import React, { useEffect } from 'react';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ cartLength, isMobileMenuOpen, setIsMobileMenuOpen, setIsCartOpen, setSearchQuery }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userRole = decodedToken ? decodedToken.role : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add event listener to handle clicks outside menu
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Prevent menu from closing when clicking inside
  const handleMenuContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
      isMobileMenuOpen ? "bg-white" : "bg-white/90"
    } backdrop-blur-md shadow-lg ${
      isMobileMenuOpen ? "rounded-lg" : "rounded-full"
    } px-6 py-3 z-50 w-11/12 max-w-6xl border border-gray-200/20`}>
      <div className="flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 mr-3 rounded-full shadow-md" />
          </Link>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              M/S ANJALI ENTERPRISE
            </h1>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:hidden">
              ANJALI
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-link group">
            <span>Home</span>
            <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
          </Link>
          <Link to="/products" className="nav-link group">
            <span>Products</span>
            <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
          </Link>
          {userRole === 'user' && (
            <Link to="/orders" className="nav-link group">
              <span>Order</span>
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
            </Link>
          )}
          {userRole === 'admin' && (
            <Link to="/admin" className="nav-link group">
              <span>Admin</span>
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login" className="nav-link group">
                <span>Login</span>
                <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
              </Link>
              <Link to="/signup" className="nav-link group">
                <span>Sign Up</span>
                <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-link group">
              <span>Logout</span>
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-blue-500"></div>
            </button>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart Button - Hide for Admin */}
          {userRole !== 'admin' && (
            <button onClick={() => setIsCartOpen(true)} className="flex items-center p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartLength > 0 && (
                <span className="ml-1 px-2 py-0.5 text-sm font-medium bg-blue-500 text-white rounded-full">
                  {cartLength}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu Button with improved click handling */}
          <button 
            onClick={handleMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with click propagation prevention */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-container md:hidden mt-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200/20"
          onClick={handleMenuContainerClick}
        >
          <div className="flex flex-col space-y-3">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            {userRole === 'user' && (
              <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Order</Link>
            )}
            {userRole === 'admin' && (
              <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
            )}
            {!token ? (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="mobile-nav-link w-full text-left">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
