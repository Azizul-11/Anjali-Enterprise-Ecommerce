// import React, { useEffect } from 'react';

// const CartItem = ({ item, removeFromCart, updateQuantity }) => {
//   useEffect(() => {
//     console.log(item); // Log the item object to check its structure
//   }, [item]);

//   return (
//     <li className="py-6 flex">
//       <div className="flex-shrink-0 w-24 h-24">
//         <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
//       </div>
//       <div className="ml-4 flex-1 flex flex-col">
//         <div>
//           <div className="flex justify-between text-base font-medium text-gray-900">
//             <h3>{item.name}</h3>
//             <p className="ml-4">₹{item.price}</p>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">{item.category}</p>
//         </div>
//         <div className="flex-1 flex items-end justify-between text-sm">
//           <div className="flex items-center">
//             <button
//               type="button"
//               onClick={() => updateQuantity(item._id, item.quantity - 1)}
//               className="text-gray-600 hover:text-gray-900"
//             >
//               -
//             </button>
//             <span className="mx-2">{item.quantity}</span>
//             <button
//               type="button"
//               onClick={() => updateQuantity(item._id, item.quantity + 1)}
//               className="text-gray-600 hover:text-gray-900"
//             >
//               +
//             </button>
//           </div>
//           <button type="button" onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-500">
//             Remove
//           </button>
//         </div>
//       </div>
//     </li>
//   );
// };

// export default CartItem;



import React from 'react';
import { Minus, Plus, X } from 'lucide-react';

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      {/* Image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
            {/* <p className="mt-1 text-sm text-gray-500">{item.category}</p> */}
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="font-medium text-gray-900">₹{item.price}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;