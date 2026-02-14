import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AddProductForm from '../components/AddProductForm';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const { shopId } = useParams();
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  
  const { user } = useAuth();

  useEffect(() => {
    fetchShopAndProducts();
  }, [shopId]);

  const fetchShopAndProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch shop details
      const shopResponse = await fetch(`http://localhost:5001/api/shops/${shopId}`);
      const shopData = await shopResponse.json();
      
      if (shopResponse.ok) {
        setShop(shopData.shop);
      } else {
        setError(shopData.message);
        return;
      }

      // Fetch products
      const productsResponse = await fetch(`http://localhost:5001/api/products/shop/${shopId}`);
      const productsData = await productsResponse.json();
      
      if (productsResponse.ok) {
        setProducts(productsData.products);
      } else {
        setError(productsData.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
    setShowAddForm(false);
  };

  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`http://localhost:5001/api/products?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
      }
    } catch (err) {
      setError('Failed to apply filters');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {shop?.name || 'Shop Products'}
              </h1>
              <p className="text-gray-600">
                {shop?.address?.street}, {shop?.address?.city}
              </p>
            </div>
            
            {user?.role === 'shop_owner' && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddProductForm
              shopId={shopId}
              onProductAdded={handleProductAdded}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="grocery">Grocery</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={applyFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg sm:text-xl">No products found</div>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              {user?.role === 'shop_owner' ? 'Add your first product to get started!' : 'This shop hasn\'t added any products yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
