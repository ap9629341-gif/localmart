import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import SimpleLogin from './pages/SimpleLogin';
import Shops from './pages/Shops';
import Products from './pages/Products';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<SimpleLogin />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/products/:shopId" element={<Products />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
