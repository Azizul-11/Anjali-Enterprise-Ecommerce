import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

const ShoppingCart = ({ cartItems = [], removeFromCart, updateQuantity, setIsCartOpen, calculateTotal }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <ul className="mb-4">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <CartItem
                key={item._id} // Ensure the key is unique
                item={{ ...item.product, quantity: item.quantity }} // Include quantity in the item object
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </ul>
        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total:</span>
          <span>₹{calculateTotal()}</span>
        </div>
        <div className="flex justify-between">
          <button onClick={() => setIsCartOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
          <Link to="/checkout" className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setIsCartOpen(false)}>Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;