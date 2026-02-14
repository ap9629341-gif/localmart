import React, { createContext, useContext, useReducer } from 'react';

// Cart ka initial state
const initialState = {
  items: [],        // Cart mein products
  total: 0,         // Total price
  itemCount: 0,     // Total items count
  isOpen: false     // Cart sidebar open/closed
};

// Cart actions - cart mein kya karna hai
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Product cart mein add karna
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        // Agar product already hai toh quantity badhao
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        };
      } else {
        // Naya product add karo
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price
        };
      }

    case 'REMOVE_FROM_CART':
      // Product cart se remove karna
      const itemToRemove = state.items.find(item => item._id === action.payload);
      const updatedItems = state.items.filter(item => item._id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        itemCount: state.itemCount - itemToRemove.quantity,
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };

    case 'UPDATE_QUANTITY':
      // Product quantity update karna
      const itemToUpdate = state.items.find(item => item._id === action.payload.id);
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      
      const itemsWithUpdatedQuantity = state.items.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      return {
        ...state,
        items: itemsWithUpdatedQuantity,
        itemCount: state.itemCount + quantityDiff,
        total: state.total + (action.payload.price * quantityDiff)
      };

    case 'TOGGLE_CART':
      // Cart sidebar open/close karna
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLEAR_CART':
      // Cart ko empty karna
      return {
        ...initialState
      };

    default:
      return state;
  }
};

// Cart context create karo
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cart actions - easy to use functions
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const product = state.items.find(item => item._id === productId);
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id: productId, quantity, price: product.price } 
      });
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
