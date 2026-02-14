import React, { useState } from 'react';
import './App.css';

// Types
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: 'customer' | 'shop_owner';
// };

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  image?: string;
  icon?: string;
  quantity?: string;
  unit?: string;
};

// type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   weight?: string;
//   image: string;
// };

type Role = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type ProductVariant = {
  id: string;
  name: string;
  price: number;
  unit: string;
  badge?: string;
};

type CatalogProduct = {
  id: string;
  name: string;
  icon: string;
  variants: ProductVariant[];
};

interface Toast {
  id: string;
  message: string;
  icon: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'auth' | 'shopkeeper-dashboard' | 'category' | 'customer-home'>('auth');
  // const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMultiCategoryModal, setShowMultiCategoryModal] = useState(false);
  const [shopName] = useState('मेरी दुकान 🏪');
  const [ownerName] = useState('राम शर्मा जी');
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedLoginRole, setSelectedLoginRole] = useState<string>('customer');

  // Cart State
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string;
  }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');

  // Translation function
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      hindi: {
        yourCart: 'आपका कार्ट',
        cartEmpty: 'कार्ट खाली है',
        total: 'कुल:',
        paymentMethod: 'भुगतान का तरीका',
        cod: 'कैश ऑन डिलवरी',
        online: 'ऑनलाइन पेमेंट',
        upi: 'यूपीआई',
        wallet: 'वॉलेट',
        checkout: 'ऑर्डर करें',
        // App content
        appTitle: 'लोकल मार्ट',
        subtitle: 'आपका अपना ग्रोसरी स्टोर',
        location: 'Delivering near to yashwant smart city sterling heights',
        searchPlaceholder: 'Search for vegetables, fruits, groceries...',
        todaysOffer: 'आज का ऑफर',
        offerText: 'सभी सब्जियों पर 20% की छूट',
        offerTimer: 'केवल 2 घंटे बाकी',
        vegetables: 'सब्ज़ियाँ',
        fruits: 'फल',
        dailyEssentials: 'दैनिक एसेंशयल्स',
        seeAll: 'सभी देखें →',
        // Products
        tomato: 'टमाटर',
        potato: 'आलू',
        onion: 'प्याज',
        cabbage: 'पत्ता गोभी',
        cucumber: 'खीरा',
        apple: 'सेब',
        banana: 'केला',
        orange: 'संतरा',
        mango: 'अंगूर',
        grapes: 'अंगूर',
        milk: 'दूध',
        bread: 'रोटी',
        eggs: 'अंडे',
        butter: 'मक्खन',
        cheese: 'पनीर',
        // Weights
        kg1: '1 किग्रा',
        kg2: '2 किग्रा',
        g500: '500 ग्राम',
        dozen1: '1 दर्जन',
        // UI Labels
        selectRole: 'अपनी भूमिका चुनें',
        backToRoleSelection: 'वापस भूमिका चुनें',
        emptyInventory: 'इन्वेंट्री में कोई उत्पाद नहीं',
        emptyInventoryMessage: 'ऊपर दी गई श्रेणियों से उत्पाद जोड़कर शुरू करें। अपनी दुकान इन्वेंट्री में वस्तुओं को जोड़ने के लिए किसी भी श्रेणी पर क्लिक करें।',
        goBack: 'वापस जाएं',
        // Product Names
        ginger: 'रेजर',
        // Product Weights
        piece1: '1 पीस',
        // Features
        fastDelivery: 'तेज़ डिलीवरी',
        fastDeliveryDesc: '30 मिनट में घर पहुंचाएं',
        lowestPrice: 'बाज़ार से भी कम कीमत',
        lowestPriceDesc: 'बाज़ार से भी कम कीमत',
        freshProducts: 'फ्रेश उत्पाद',
        freshProductsDesc: 'ताज़ा और गुणवत्ता वाले'
      },
      english: {
        yourCart: 'Your Cart',
        cartEmpty: 'Cart is Empty',
        total: 'Total:',
        paymentMethod: 'Payment Method',
        cod: 'Cash on Delivery',
        online: 'Card Payment',
        upi: 'UPI',
        wallet: 'Wallet',
        checkout: 'Checkout',
        // App content
        appTitle: 'Local Mart',
        subtitle: 'Your Grocery Store',
        location: 'Delivering near to yashwant smart city sterling heights',
        searchPlaceholder: 'Search for vegetables, fruits, groceries...',
        todaysOffer: 'Today\'s Offer',
        offerText: '20% off on all vegetables',
        offerTimer: 'Only 2 hours left',
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        dailyEssentials: 'Daily Essentials',
        seeAll: 'See All →',
        // Products
        tomato: 'Tomato',
        potato: 'Potato',
        onion: 'Onion',
        cabbage: 'Cabbage',
        cucumber: 'Cucumber',
        apple: 'Apple',
        banana: 'Banana',
        orange: 'Orange',
        mango: 'Mango',
        grapes: 'Grapes',
        milk: 'Milk',
        bread: 'Bread',
        eggs: 'Eggs',
        butter: 'Butter',
        cheese: 'Cheese',
        // Weights
        kg1: '1 kg',
        kg2: '2 kg',
        g500: '500 g',
        dozen1: '1 dozen',
        // UI Labels
        selectRole: 'Select Your Role',
        backToRoleSelection: 'Back to Role Selection',
        emptyInventory: 'No products in inventory',
        emptyInventoryMessage: 'Click on any category above to add products to your shop inventory. Add items to your shop inventory by clicking on any category.',
        goBack: 'Go Back',
        // Product Names
        ginger: 'Ginger',
        // Product Weights
        piece1: '1 piece',
        // Features
        fastDelivery: 'Fast Delivery',
        fastDeliveryDesc: 'Delivery in 30 minutes',
        lowestPrice: 'Lowest Price',
        lowestPriceDesc: 'Lower than market price',
        freshProducts: 'Fresh Products',
        freshProductsDesc: 'Fresh and quality products'
      }
    };
    
    return translations[language]?.[key] || key;
  };

  // Debug function to check language state
  const handleLanguageChange = (newLanguage: 'hindi' | 'english') => {
    console.log('Language changed from', language, 'to', newLanguage);
    setLanguage(newLanguage);
  };

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Shop inventory - products added by shopkeeper
  const [shopInventory, setShopInventory] = useState<Product[]>([]);

  // Roles for selection
  const roles: Role[] = [
    {
      id: 'customer',
      name: 'ग्राहक',
      icon: '🛍️',
      description: 'खरीदारी करने के लिए',
      color: '#4caf50'
    },
    {
      id: 'shopkeeper',
      name: 'दुकानदार',
      icon: '🏪',
      description: 'अपनी दुकान प्रबंधित करने के लिए',
      color: '#ff6b35'
    },
    {
      id: 'merchant',
      name: 'व्यापारी',
      icon: '🚚',
      description: 'बड़े पैमाने पर व्यापार करने के लिए',
      color: '#9c27b0'
    }
  ];

  const categories: Category[] = [
    {
      id: 'vegetables',
      name: 'सब्ज़ियाँ',
      icon: '🥕',
      description: 'ताज़ी और जैविक सब्ज़ियाँ'
    },
    {
      id: 'fruits',
      name: 'फल',
      icon: '🍎',
      description: 'मौसमी और उष्णकटिबंधीय फल'
    },
    {
      id: 'food-grains',
      name: 'अनाज',
      icon: '🌾',
      description: 'चावल, गेहूँ और अन्य अनाज'
    },
    {
      id: 'nuts-dry-fruits',
      name: 'नट्स और सूखे मेवे',
      icon: '🥜',
      description: 'प्रीमियम नट्स और सूखे मेवे'
    },
    {
      id: 'dairy',
      name: 'डेयरी',
      icon: '🥛',
      description: 'दूध, पनीर और डेयरी उत्पाद'
    },
    {
      id: 'multi-category',
      name: 'सब कुछ 📦',
      icon: '📦',
      description: 'कई श्रेणियों के उत्पाद'
    }
  ];

  const [multiCategoryProducts, setMultiCategoryProducts] = useState<Product[]>([
    { id: '1', name: 'Oil', icon: '🛢️', price: 0, quantity: '', unit: 'litre', category: 'multi-category', stock: 0 },
    { id: '2', name: 'Salt', icon: '🧂', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 },
    { id: '3', name: 'Dal', icon: '🫘', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 },
    { id: '4', name: 'Rice', icon: '🍚', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 },
    { id: '5', name: 'Wheat', icon: '🌾', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 },
    { id: '6', name: 'Potato', icon: '🥔', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 },
    { id: '7', name: 'Onion', icon: '🧅', price: 0, quantity: '', unit: 'kg', category: 'multi-category', stock: 0 }
  ]);

  // Toast notification functions
  const addToast = (message: string, icon: string = '✓') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, icon };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    // Simulate login validation
    if (!email || !password) {
      setLoginError('कृपया ईमेल और पासवर्ड दर्ज करें');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Simple validation
      if (email.includes('@') && password.length >= 6) {
        // Success - navigate based on selected role
        addToast('लॉगिन सफलत! 🎉');
        
        if (selectedLoginRole === 'customer') {
          setCurrentView('customer-home');
        } else if (selectedLoginRole === 'shopkeeper') {
          setCurrentView('shopkeeper-dashboard');
        } else if (selectedLoginRole === 'merchant') {
          addToast('व्यापारी पोर्टल जल्द आ रहा है! 🚧');
        }
        
        setEmail('');
        setPassword('');
      } else {
        // Error
        setLoginError('गलत ईमेल या पासवर्ड');
      }
      setIsLoading(false);
    }, 1500);
  };

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
    setSignupError('');

    // Simulate signup validation
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('कृपया सभी फ़ील्ड भरें');
      setIsSignupLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('पासवर्ड मेल नहीं खाते');
      setIsSignupLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      setIsSignupLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Success - navigate based on selected role
      addToast('खाता बनाया गया! 🎉');
      
      if (selectedLoginRole === 'customer') {
        setCurrentView('customer-home');
      } else if (selectedLoginRole === 'shopkeeper') {
        setCurrentView('shopkeeper-dashboard');
      } else if (selectedLoginRole === 'merchant') {
        addToast('व्यापारी पोर्टल जल्द आ रहा है! 🚧');
      }
      
      // Clear signup form
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setIsSignupLoading(false);
    }, 1500);
  };

  // Navigate to signup
  const handleGoToSignup = () => {
    setAuthMode('signup');
    setLoginError('');
    setSignupError('');
  };

  // Cart Functions
  const addToCart = (product: {
    id: string;
    name: string;
    price: number;
    weight: string;
    image: string;
  }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Show toast notification
    addToast(`${product.name} कार्ट में जोड़ा गया!`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert(language === 'hindi' ? 'कार्ट में कम से एक उत्पाद जोड़ें!' : 'Cart is empty! Please add items to checkout.');
      return;
    }
    
    const orderData = {
      items: cartItems,
      totalAmount: getCartTotal(),
      paymentMethod: selectedPaymentMethod,
      deliveryAddress: {
        street: '123 Main St',
        area: 'Downtown',
        city: language === 'hindi' ? 'मुंबई' : 'Mumbai',
        pincode: '400001',
        coordinates: [72.8777, 19.0760]
      }
    };
    
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(language === 'hindi' ? 'ऑर्डर सफलतापूर्वा गया! 🎉' : 'Order placed successfully! 🎉');
        setCartItems([]);
        setIsCartOpen(false);
      }
    })
    .catch(error => {
      console.error('Order error:', error);
      alert(language === 'hindi' ? 'ऑर्डर करने में त्रुटि हुई। कृपया करें।' : 'Order failed. Please try again.');
    });
  };

  // Navigate back to login
  const handleGoToLogin = () => {
    setAuthMode('login');
    setLoginError('');
  };

  // Category click handler
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log(`Selected category: ${categoryId}`);
    
    if (categoryId === 'multi-category') {
      setShowMultiCategoryModal(true);
    } else {
      // Navigate to category detail page
      setCurrentView('category');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('shopkeeper-dashboard');
    setSelectedCategory(null);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    alert('Profile settings coming soon!');
  };

  const handleViewOrders = () => {
    console.log('View orders clicked');
    alert('Orders management coming soon!');
  };

  const handleManageProducts = () => {
    console.log('Manage products clicked');
    alert('Product management coming soon!');
  };

  const handleProductChange = (productId: string, field: keyof Product, value: string) => {
    setMultiCategoryProducts(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, [field]: value } : product
      )
    );
  };

  const handleAddProduct = (productId: string) => {
    const product = multiCategoryProducts.find(p => p.id === productId);
    
    if (product && product.price && product.quantity) {
      // Add to shop inventory
      const newProduct: Product = {
        ...product,
        id: `shop-${Date.now()}-${productId}`, // Unique ID for shop inventory
      };
      
      setShopInventory(prev => [...prev, newProduct]);
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.add(productId);
        return newSet;
      });
      
      // Show success toast
      addToast(`${product.name} added successfully! 🎉`);
      
      console.log('Product added to inventory:', {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        unit: product.unit
      });
    } else {
      alert('Please fill in both price and quantity fields');
    }
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
  };

  const handleSaveEdit = (productId: string, newPrice: string, newQuantity: string) => {
    setShopInventory(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, price: parseFloat(newPrice) || 0, quantity: newQuantity }
          : product
      )
    );
    
    const product = shopInventory.find(p => p.id === productId);
    if (product) {
      addToast(`${product.name} updated successfully! ✏️`);
    }
    
    setEditingProductId(null);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = shopInventory.find(p => p.id === productId);
    if (product && window.confirm(`Are you sure you want to remove ${product.name} from your inventory?`)) {
      setShopInventory(prev => prev.filter(p => p.id !== productId));
      addToast(`${product.name} removed from inventory 🗑️`);
    }
  };

  const handleCloseModal = () => {
    setShowMultiCategoryModal(false);
  };

  const handleSaveAll = () => {
    const validProducts = multiCategoryProducts.filter(p => 
      addedProducts.has(p.id) && p.price && p.quantity
    );
    
    if (validProducts.length > 0) {
      console.log('Saving products:', validProducts);
      addToast(`${validProducts.length} products saved to inventory! 💾`);
      handleCloseModal();
    } else {
      alert('No products to save. Please add at least one product.');
    }
  };

  // Complete product catalog for each category
  const productCatalog: Record<string, CatalogProduct[]> = {
    vegetables: [
      {
        id: 'veg1',
        name: 'टमाटर',
        icon: '🍅',
        variants: [
          { id: 'v1', name: 'देसी टमाटर', price: 40, unit: 'किलो', badge: 'लोकप्रिय' },
          { id: 'v2', name: 'हाइब्रिड टमाटर', price: 60, unit: 'किलो', badge: 'प्रीमियम' }
        ]
      },
      {
        id: 'veg2',
        name: 'आलू',
        icon: '🥔',
        variants: [
          { id: 'v3', name: 'सफेद आलू', price: 25, unit: 'किलो' },
          { id: 'v4', name: 'लाल आलू', price: 35, unit: 'किलो', badge: 'नया' }
        ]
      },
      {
        id: 'veg3',
        name: 'प्याज़',
        icon: '🧅',
        variants: [
          { id: 'v5', name: 'सफेद प्याज़', price: 30, unit: 'किलो' },
          { id: 'v6', name: 'लाल प्याज़', price: 40, unit: 'किलो', badge: 'लोकप्रिय' }
        ]
      },
      {
        id: 'veg4',
        name: 'मिर्च',
        icon: '🌶️',
        variants: [
          { id: 'v7', name: 'हरी मिर्च', price: 80, unit: 'किलो' },
          { id: 'v8', name: 'लाल मिर्च', price: 120, unit: 'किलो', badge: 'तीखा' }
        ]
      },
      {
        id: 'veg5',
        name: 'गोभी',
        icon: '🥬',
        variants: [
          { id: 'v9', name: 'हरी गोभी', price: 20, unit: 'किलो' },
          { id: 'v10', name: 'फूलगोभी', price: 40, unit: 'किलो' }
        ]
      },
      {
        id: 'veg6',
        name: 'गाजर',
        icon: '🥕',
        variants: [
          { id: 'v11', name: 'लाल गाजर', price: 35, unit: 'किलो', badge: 'ताज़ा' },
          { id: 'v12', name: 'देसी गाजर', price: 25, unit: 'किलो' }
        ]
      }
    ],
    fruits: [
      {
        id: 'fruit1',
        name: 'सेब',
        icon: '🍎',
        variants: [
          { id: 'f1', name: 'देसी सेब', price: 120, unit: 'किलो', badge: 'मीठा' },
          { id: 'f2', name: 'इम्पोर्टेड सेब', price: 200, unit: 'किलो', badge: 'प्रीमियम' }
        ]
      },
      {
        id: 'fruit2',
        name: 'केला',
        icon: '🍌',
        variants: [
          { id: 'f3', name: 'पहले केला', price: 40, unit: 'दर्जन' },
          { id: 'f4', name: 'अमरुद केला', price: 60, unit: 'दर्जन', badge: 'छोटा' }
        ]
      },
      {
        id: 'dairy4',
        name: 'मक्खन',
        icon: '🧈',
        variants: [
          { id: 'd7', name: 'देसी मक्खन', price: 300, unit: 'किलो', badge: 'पिघला' },
          { id: 'd8', name: 'पैक्ड मक्खन', price: 350, unit: 'किलो', badge: 'पैक्ड' }
        ]
      },
      {
        id: 'dairy5',
        name: 'अंडा',
        icon: '🥚',
        variants: [
          { id: 'd9', name: 'देसी अंडा', price: 6, unit: 'नग', badge: 'जैविक' },
          { id: 'd10', name: 'फार्म अंडा', price: 5, unit: 'नग' }
        ]
      }
    ],
    'food-grains': [
      {
        id: 'grain1',
        name: 'चावल',
        icon: '🍚',
        variants: [
          { id: 'g1', name: 'बासमती चावल', price: 120, unit: 'किलो', badge: 'प्रीमियम' },
          { id: 'g2', name: 'सादा चावल', price: 60, unit: 'किलो' }
        ]
      },
      {
        id: 'grain2',
        name: 'गेहूँ',
        icon: '🌾',
        variants: [
          { id: 'g3', name: 'लाल गेहूँ', price: 40, unit: 'किलो' },
          { id: 'g4', name: 'सफेद गेहूँ', price: 35, unit: 'किलो' }
        ]
      },
      {
        id: 'grain3',
        name: 'दाल',
        icon: '🫘',
        variants: [
          { id: 'g5', name: 'अरहर दाल', price: 80, unit: 'किलो', badge: 'लोकप्रिय' },
          { id: 'g6', name: 'मूंग दाल', price: 100, unit: 'किलो' },
          { id: 'g7', name: 'मसूर दाल', price: 70, unit: 'किलो' }
        ]
      }
    ],
    'nuts-dry-fruits': [
      {
        id: 'nut1',
        name: 'बादाम',
        icon: '🌰',
        variants: [
          { id: 'n1', name: 'कैलिफोर्निया', price: 600, unit: 'किलो', badge: 'प्रीमियम' },
          { id: 'n2', name: 'देसी बादाम', price: 500, unit: 'किलो' }
        ]
      },
      {
        id: 'nut2',
        name: 'अखरोट',
        icon: '🥜',
        variants: [
          { id: 'n3', name: 'काश्मीरी अखरोट', price: 800, unit: 'किलो', badge: 'बेस्ट' },
          { id: 'n4', name: 'देसी अखरोट', price: 600, unit: 'किलो' }
        ]
      },
      {
        id: 'nut3',
        name: 'किशमिश',
        icon: '🍇',
        variants: [
          { id: 'n5', name: 'काला किशमिश', price: 300, unit: 'किलो' },
          { id: 'n6', name: 'गुलाबी किशमिश', price: 280, unit: 'किलो' }
        ]
      }
    ],
    'multi-category': [
      {
        id: 'multi1',
        name: 'तेल',
        icon: '🛢️',
        variants: [
          { id: 'm1', name: 'सरसों तेल', price: 150, unit: 'लीटर', badge: 'लोकप्रिय' },
          { id: 'm2', name: 'रिफाइंड तेल', price: 120, unit: 'लीटर' },
          { id: 'm3', name: 'ऑलिव ऑयल', price: 300, unit: 'लीटर', badge: 'प्रीमियम' }
        ]
      },
      {
        id: 'multi2',
        name: 'नमक',
        icon: '🧂',
        variants: [
          { id: 'm4', name: 'सेंधा नमक', price: 20, unit: 'किलो' },
          { id: 'm5', name: 'काला नमक', price: 40, unit: 'किलो', badge: 'हेल्थी' }
        ]
      },
      {
        id: 'multi3',
        name: 'चीनी',
        icon: '🍚',
        variants: [
          { id: 'm6', name: 'देसी चीनी', price: 40, unit: 'किलो' },
          { id: 'm7', name: 'खांड़ारी', price: 50, unit: 'किलो', badge: 'हेल्थी' }
        ]
      },
      {
        id: 'multi4',
        name: 'चाय',
        icon: '🍵',
        variants: [
          { id: 'm8', name: 'दार्जीलिंग', price: 300, unit: 'किलो' },
          { id: 'm9', name: 'असम चाय', price: 250, unit: 'किलो' }
        ]
      }
    ]
  };

  // Group products by category
  const groupedInventory = shopInventory.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Get current category data
  const currentCategoryData = selectedCategory ? categories.find(c => c.id === selectedCategory) : null;
  const currentCategoryProducts = selectedCategory ? productCatalog[selectedCategory] || [] : [];

  const handleAddCatalogProduct = (product: CatalogProduct, variant: ProductVariant) => {
    const newProduct: Product = {
      id: `shop-${Date.now()}-${product.id}-${variant.id}`,
      name: `${product.name} (${variant.name})`,
      icon: product.icon,
      price: variant.price,
      quantity: '0',
      unit: variant.unit,
      category: selectedCategory || 'multi-category',
      stock: 0
    };
    
    setShopInventory(prev => [...prev, newProduct]);
    addToast(`${newProduct.name} इन्वेंट्री में जोड़ा गया! 🎉`);
  };

  return (
    <>
      {/* Premium Background */}
      <div className="premium-bg"></div>
      
      {/* Premium Orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span className="toast-icon">{toast.icon}</span>
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close" 
              onClick={() => removeToast(toast.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Header - Only show when not on auth page */}
      {currentView !== 'auth' && (
        <header className="app-header">
          <div className="header-left">
            <div className="shop-info">
              <div className="shop-name">{shopName}</div>
              <div className="owner-name">{ownerName}</div>
            </div>
          </div>
          
          <div className="profile-section">
            <div className="profile-info">
              <div className="profile-name">{ownerName}</div>
              <div className="profile-role">Shop Owner</div>
            </div>
            <div className="profile-icon" onClick={handleProfileClick}>
              👤
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      {currentView === 'auth' ? (
        /* Single Page Auth - Login & Signup */
        <main className="auth-content">
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-logo">🏪</div>
              <h1 className="auth-title">Local Mart</h1>
              <p className="auth-subtitle">
                आपकी स्थानीय बाज़ार में स्वागत हैं
              </p>
            </div>

            {/* Role Selection */}
            <div className="role-selection-section">
              <h3 className="role-selection-label">{t('selectRole')}</h3>
              <div className="auth-role-grid">
                {roles.slice(0, 2).map((role) => (
                  <div
                    key={role.id}
                    className={`auth-role-card ${selectedLoginRole === role.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLoginRole(role.id)}
                    style={{ '--role-color': role.color } as React.CSSProperties}
                  >
                    <div className="auth-role-icon">{role.icon}</div>
                    <div className="auth-role-name">{role.name}</div>
                    <div className="auth-role-description">{role.description}</div>
                    {selectedLoginRole === role.id && (
                      <div className="role-selected-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Mode Toggle */}
            <div className="auth-mode-toggle">
              <button 
                className={`auth-mode-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={handleGoToLogin}
              >
                Login
              </button>
              <button 
                className={`auth-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={handleGoToSignup}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' && (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">ईमेल पता</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="अपना ईमेल दर्ज करें"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">पासवर्ड</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="अपना पासवर्ड दर्ज करें"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {loginError && (
                  <div className="error-message">
                    <span>⚠️</span>
                    {loginError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      लॉग इन हो रहा है...
                    </>
                  ) : (
                    <>
                      <span>🔐</span>
                      {selectedLoginRole === 'customer' ? 'Login as Customer' : 
                       selectedLoginRole === 'shopkeeper' ? 'Login as Shopkeeper' : 
                       'Login as Merchant'}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {authMode === 'signup' && (
              <form className="auth-form" onSubmit={handleSignup}>
                <div className="form-group">
                  <label className="form-label">पूरा नाम</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="अपना पूरा नाम दर्ज करें"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ईमेल पता</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="अपना ईमेल दर्ज करें"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">पासवर्ड</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="अपना पासवर्ड दर्ज करें"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">पासवर्ड की पुष्टि करें</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="पासवर्ड दोबारा दर्ज करें"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {signupError && (
                  <div className="error-message">
                    <span>⚠️</span>
                    {signupError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      खाता बनाया जा रहा है...
                    </>
                  ) : (
                    <>
                      <span>📝</span>
                      {selectedLoginRole === 'customer' ? 'Create Customer Account' : 
                       selectedLoginRole === 'shopkeeper' ? 'Create Shopkeeper Account' : 
                       'Create Merchant Account'}
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>
                {authMode === 'login' ? (
                  <>New here? <button className="auth-link" onClick={handleGoToSignup}>Create an account</button></>
                ) : (
                  <>Already have an account? <button className="auth-link" onClick={handleGoToLogin}>Sign in</button></>
                )}
              </p>
            </div>
          </div>
        </main>
      ) : currentView === 'customer-home' ? (
        /* Customer Home Screen - Mobile-First Grocery App */
        <main className="customer-home-content">
          {/* Language Switcher */}
          <div className="language-switcher">
            <button 
              className={`language-btn ${language === 'hindi' ? 'active' : ''}`}
              onClick={() => setLanguage('hindi')}
            >
              🇮🇳 हिंदी
            </button>
            <button 
              className={`language-btn ${language === 'english' ? 'active' : ''}`}
              onClick={() => setLanguage('english')}
            >
              🇬🇧 English
            </button>
          </div>
          {/* Cart Icon */}
          <div className="cart-icon-container" onClick={() => setIsCartOpen(!isCartOpen)}>
            <div className="cart-icon">🛒</div>
            {getCartCount() > 0 && (
              <div className="cart-count">{getCartCount()}</div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
            <div className="cart-header">
              <h3>{t('yourCart')}</h3>
              <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">{t('cartEmpty')}</div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">{item.image}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-weight">{item.weight}</div>
                      <div className="cart-item-price">₹{item.price}</div>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>{t('total')}</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="payment-options">
                  <h4>{t('paymentMethod')}</h4>
                  <div className="payment-methods">
                    <button 
                      className={`payment-method ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('cod')}
                    >
                      <span className="payment-icon">💵</span>
                      <span className="payment-label">{t('cod')}</span>
                    </button>
                    <button 
                      className={`payment-method ${selectedPaymentMethod === 'online' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('online')}
                    >
                      <span className="payment-icon">💳</span>
                      <span className="payment-label">{t('online')}</span>
                    </button>
                    <button 
                      className={`payment-method ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('upi')}
                    >
                      <span className="payment-icon">📱</span>
                      <span className="payment-label">{t('upi')}</span>
                    </button>
                    <button 
                      className={`payment-method ${selectedPaymentMethod === 'wallet' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('wallet')}
                    >
                      <span className="payment-icon">👛</span>
                      <span className="payment-label">{t('wallet')}</span>
                    </button>
                  </div>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  {t('checkout')} ₹{getCartTotal()}
                </button>
              </div>
            )}
          </div>

          {/* Cart Overlay */}
          {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}
          {/* Header Section */}
          <div className="customer-header">
            <div className="customer-welcome">
              <h1 className="customer-title">🛍️ {t('appTitle')}</h1>
              <p className="customer-subtitle">{t('subtitle')}</p>
              <div className="customer-location">
                <div className="location-text">
                  {t('location')}
                </div>
              </div>
              <div className="customer-search">
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="customer-search">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search for vegetables, fruits, groceries..."
                className="search-input"
              />
            </div>
          </div>

          {/* Special Offers Banner */}
          <div className="offers-banner">
            <div className="offer-content">
              <div className="offer-badge">🎉 {t('todaysOffer')}</div>
              <div className="offer-text">{t('offerText')}</div>
              <div className="offer-timer">⏰ {t('offerTimer')}</div>
            </div>
          </div>

          {/* Vegetables Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🥕 {t('vegetables')}</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">🍅</div>
                <div className="product-info">
                  <div className="product-name">{t('tomato')}</div>
                  <div className="product-weight">{t('kg1')}</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'tomato',
                  name: t('tomato'),
                  price: 40,
                  weight: t('kg1'),
                  image: '🍅'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥔</div>
                <div className="product-info">
                  <div className="product-name">{language === 'hindi' ? 'आलू' : 'Potato'}</div>
                  <div className="product-weight">{language === 'hindi' ? '2 किग्रा' : '2 kg'}</div>
                  <div className="product-price">₹60</div>
                  <div className="product-original-price">₹80</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'potato',
                  name: t('potato'),
                  price: 60,
                  weight: t('kg2'),
                  image: '🥔'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧅</div>
                <div className="product-info">
                  <div className="product-name">{language === 'hindi' ? 'प्याज' : 'Onion'}</div>
                  <div className="product-weight">{language === 'hindi' ? '1 किग्रा' : '1 kg'}</div>
                  <div className="product-price">₹35</div>
                  <div className="product-original-price">₹45</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'onion',
                  name: t('onion'),
                  price: 35,
                  weight: t('kg1'),
                  image: '🧅'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥬</div>
                <div className="product-info">
                  <div className="product-name">{t('cabbage')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹25</div>
                  <div className="product-original-price">₹30</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'cabbage',
                  name: t('cabbage'),
                  price: 25,
                  weight: t('g500'),
                  image: '🥬'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥒</div>
                <div className="product-info">
                  <div className="product-name">{t('cucumber')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹30</div>
                  <div className="product-original-price">₹40</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'cucumber',
                  name: language === 'hindi' ? 'खीरा' : 'Cucumber',
                  price: 30,
                  weight: language === 'hindi' ? '500 ग्राम' : '500 g',
                  image: '🥒'
                })}>+</button>
              </div>
            </div>
          </div>

          {/* Fruits Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🍎 {t('fruits')}</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">🍎</div>
                <div className="product-info">
                  <div className="product-name">{t('apple')}</div>
                  <div className="product-weight">{t('kg1')}</div>
                  <div className="product-price">₹120</div>
                  <div className="product-original-price">₹150</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'apple',
                  name: t('apple'),
                  price: 120,
                  weight: t('kg1'),
                  image: '🍎'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🍌</div>
                <div className="product-info">
                  <div className="product-name">{t('banana')}</div>
                  <div className="product-weight">{t('dozen1')}</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'banana',
                  name: t('banana'),
                  price: 40,
                  weight: t('dozen1'),
                  image: '🍌'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🍊</div>
                <div className="product-info">
                  <div className="product-name">{language === 'hindi' ? 'संतरा' : 'Orange'}</div>
                  <div className="product-weight">{language === 'hindi' ? '1 किग्रा' : '1 kg'}</div>
                  <div className="product-price">₹80</div>
                  <div className="product-original-price">₹100</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'orange',
                  name: t('orange'),
                  price: 80,
                  weight: t('kg1'),
                  image: '🍊'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥭</div>
                <div className="product-info">
                  <div className="product-name">{t('mango')}</div>
                  <div className="product-weight">{t('kg1')}</div>
                  <div className="product-price">₹100</div>
                  <div className="product-original-price">₹120</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'mango',
                  name: t('mango'),
                  price: 100,
                  weight: t('kg1'),
                  image: '🥭'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🍇</div>
                <div className="product-info">
                  <div className="product-name">{t('grapes')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹60</div>
                  <div className="product-original-price">₹80</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'grapes',
                  name: t('grapes'),
                  price: 60,
                  weight: t('g500'),
                  image: '🍇'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥭</div>
                <div className="product-info">
                  <div className="product-name">{language === 'hindi' ? 'अंगूर' : 'Grapes'}</div>
                  <div className="product-weight">{language === 'hindi' ? '500 ग्राम' : '500 g'}</div>
                  <div className="product-price">₹60</div>
                  <div className="product-original-price">₹80</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'grapes',
                  name: language === 'hindi' ? 'अंगूर' : 'Grapes',
                  price: 60,
                  weight: language === 'hindi' ? '500 ग्राम' : '500 g',
                  image: '🍇'
                })}>+</button>
              </div>
            </div>
          </div>

          {/* Daily Essentials Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🥛 {t('dailyEssentials')}</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">🥛</div>
                <div className="product-info">
                  <div className="product-name">{t('milk')}</div>
                  <div className="product-weight">{t('kg1')}</div>
                  <div className="product-price">₹50</div>
                  <div className="product-original-price">₹60</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'milk',
                  name: t('milk'),
                  price: 50,
                  weight: t('kg1'),
                  image: '🥛'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🍞</div>
                <div className="product-info">
                  <div className="product-name">{t('bread')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹30</div>
                  <div className="product-original-price">₹40</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'bread',
                  name: t('bread'),
                  price: 30,
                  weight: t('g500'),
                  image: '🍞'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥚</div>
                <div className="product-info">
                  <div className="product-name">{t('eggs')}</div>
                  <div className="product-weight">{t('dozen1')}</div>
                  <div className="product-price">₹60</div>
                  <div className="product-original-price">₹80</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'eggs',
                  name: t('eggs'),
                  price: 60,
                  weight: t('dozen1'),
                  image: '🥚'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧈</div>
                <div className="product-info">
                  <div className="product-name">{t('butter')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹80</div>
                  <div className="product-original-price">₹100</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'butter',
                  name: t('butter'),
                  price: 80,
                  weight: '500g',
                  image: '🧈'
                })}>+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧀</div>
                <div className="product-info">
                  <div className="product-name">{t('cheese')}</div>
                  <div className="product-weight">{t('g500')}</div>
                  <div className="product-price">₹120</div>
                  <div className="product-original-price">₹150</div>
                </div>
                <button className="add-to-cart" onClick={() => addToCart({
                  id: 'cheese',
                  name: t('cheese'),
                  price: 120,
                  weight: t('g500'),
                  image: '🧀'
                })}>+</button>
              </div>
            </div>
          </div>

          {/* Grocery & Staples Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🌾 Grocery & Staples</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">�</div>
                <div className="product-info">
                  <div className="product-name">{t('rice')}</div>
                  <div className="product-weight">5 किग्रा</div>
                  <div className="product-price">₹300</div>
                  <div className="product-original-price">₹350</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🌾</div>
                <div className="product-info">
                  <div className="product-name">{t('rice')}</div>
                  <div className="product-weight">5 किग्रा</div>
                  <div className="product-price">₹200</div>
                  <div className="product-original-price">₹250</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">�</div>
                <div className="product-info">
                  <div className="product-name">{t('rice')}</div>
                  <div className="product-weight">1 किग्रा</div>
                  <div className="product-price">₹80</div>
                  <div className="product-original-price">₹100</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">�</div>
                <div className="product-info">
                  <div className="product-name">नमक</div>
                  <div className="product-weight">1 किग्रा</div>
                  <div className="product-price">₹20</div>
                  <div className="product-original-price">₹25</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🌻</div>
                <div className="product-info">
                  <div className="product-name">तेल</div>
                  <div className="product-weight">1 लीटर</div>
                  <div className="product-price">₹120</div>
                  <div className="product-original-price">₹150</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
            </div>
          </div>

          {/* Snacks & Beverages Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🍿 Snacks & Beverages</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">🍿</div>
                <div className="product-info">
                  <div className="product-name">पॉपकॉर्न</div>
                  <div className="product-weight">100 ग्राम</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">�</div>
                <div className="product-info">
                  <div className="product-name">बिस्कुट</div>
                  <div className="product-weight">200 ग्राम</div>
                  <div className="product-price">₹30</div>
                  <div className="product-original-price">₹40</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🥤</div>
                <div className="product-info">
                  <div className="product-name"> Cold Drink</div>
                  <div className="product-weight">750 मिली</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🍵</div>
                <div className="product-info">
                  <div className="product-name">चाय</div>
                  <div className="product-weight">250 ग्राम</div>
                  <div className="product-price">₹80</div>
                  <div className="product-original-price">₹100</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">☕</div>
                <div className="product-info">
                  <div className="product-name">कॉफी</div>
                  <div className="product-weight">100 ग्राम</div>
                  <div className="product-price">₹120</div>
                  <div className="product-original-price">₹150</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
            </div>
          </div>

          {/* Household Items Category */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">🧹 Household Items</h2>
              <button className="see-all-btn">{t('seeAll')}</button>
            </div>
            <div className="product-scroll">
              <div className="product-card-horizontal">
                <div className="product-image">�</div>
                <div className="product-info">
                  <div className="product-name">{t('ginger')}</div>
                  <div className="product-weight">{t('piece1')}</div>
                  <div className="product-price">₹20</div>
                  <div className="product-original-price">₹25</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧴</div>
                <div className="product-info">
                  <div className="product-name">{t('ginger')}</div>
                  <div className="product-weight">{t('piece1')}</div>
                  <div className="product-price">₹80</div>
                  <div className="product-original-price">₹100</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧻</div>
                <div className="product-info">
                  <div className="product-name">{t('ginger')}</div>
                  <div className="product-weight">{t('piece1')}</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🧹</div>
                <div className="product-info">
                  <div className="product-name">{t('ginger')}</div>
                  <div className="product-weight">1 पीस</div>
                  <div className="product-price">₹60</div>
                  <div className="product-original-price">₹80</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
              <div className="product-card-horizontal">
                <div className="product-image">🪒</div>
                <div className="product-info">
                  <div className="product-name">{t('ginger')}</div>
                  <div className="product-weight">{t('piece1')}</div>
                  <div className="product-price">₹40</div>
                  <div className="product-original-price">₹50</div>
                </div>
                <button className="add-to-cart">+</button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="customer-features">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <div className="feature-title">तेज़ डिलीवरी</div>
              <div className="feature-description">30 मिनट में घर पर पहुंचाएं</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <div className="feature-title">सबसे सस्ता</div>
              <div className="feature-description">बाज़ार से भी कम कीमत</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <div className="feature-title">फ्रेश उत्पाद</div>
              <div className="feature-description">ताज़ा और गुणवत्ता वाले</div>
            </div>
          </div>

          <button className="back-to-roles" onClick={() => setCurrentView('auth')}>
            ← {t('backToRoleSelection')}
          </button>
        </main>
      ) : currentView === 'shopkeeper-dashboard' ? (
        <main className="dashboard-content">
          {/* Dashboard Heading */}
          <div className="dashboard-section">
            <h1 className="dashboard-heading">आज क्या बेचना है? 🤔</h1>
            <p className="dashboard-subtitle">
              अपने उत्पाद जोड़ने और अपने इन्वेंट्री को प्रबंधित करने के लिए कोई श्रेणी चुनें
            </p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-value">{shopInventory.length}</div>
              <div className="stat-label">कुल उत्पाद</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">6</div>
              <div className="stat-label">श्रेणियाँ</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">आज के ऑर्डर</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">4.8</div>
              <div className="stat-label">रेटिंग ⭐</div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="category-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-desc">{category.description}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleManageProducts}>
              <span>📦</span>
              उत्पाद प्रबंधन
            </button>
            <button className="btn btn-secondary" onClick={handleViewOrders}>
              <span>📋</span>
              ऑर्डर देखें
            </button>
          </div>

          {/* Product Inventory List */}
          {shopInventory.length > 0 && (
            <div className="product-list-container">
              <div className="product-list-header">
                <h2 className="product-list-title">
                  <span>📦</span>
                  आपकी इन्वेंट्री
                </h2>
                <div className="product-count">{shopInventory.length} उत्पाद</div>
              </div>

              {/* Group products by category */}
              {Object.entries(groupedInventory).map(([category, products]) => (
                <div key={category} className="category-section">
                  <div className="category-header">
                    <div className="category-icon">
                      {categories.find(c => c.id === category)?.icon || '📦'}
                    </div>
                    <h3 className="category-title">
                      {categories.find(c => c.id === category)?.name || 'अन्य'}
                    </h3>
                    <div className="category-count">{products.length} वस्तुएं</div>
                  </div>

                  <div className="product-list">
                    {products.map((product) => (
                      <div key={product.id} className="product-item-list">
                        {editingProductId === product.id ? (
                          // Edit Mode
                          <div className="edit-form">
                            <div className="product-list-icon">{product.icon}</div>
                            <input
                              type="number"
                              className="edit-input"
                              placeholder="मूल्य"
                              defaultValue={product.price}
                              id={`price-${product.id}`}
                            />
                            <input
                              type="number"
                              className="edit-input"
                              placeholder="मात्रा"
                              defaultValue={product.quantity}
                              id={`quantity-${product.id}`}
                            />
                            <button 
                              className="save-btn"
                              onClick={() => {
                                const priceInput = document.getElementById(`price-${product.id}`) as HTMLInputElement;
                                const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement;
                                handleSaveEdit(product.id, priceInput.value, quantityInput.value);
                              }}
                            >
                              <span>✓</span>
                              सेव करें
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              <span>✕</span>
                              रद्द करें
                            </button>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="product-list-icon">{product.icon}</div>
                            <div className="product-list-info">
                              <div className="product-list-name">{product.name}</div>
                              <div className="product-list-details">
                                <div className="product-list-price">
                                  मूल्य: <strong>₹{product.price}</strong>/{product.unit}
                                </div>
                                <div className="product-list-quantity">
                                  स्टॉक: <strong>{product.quantity}</strong> {product.unit}
                                </div>
                              </div>
                            </div>
                            <div className="product-list-actions">
                              <button 
                                className="edit-btn"
                                onClick={() => handleEditProduct(product.id)}
                              >
                                <span>✏️</span>
                                बदलें
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <span>🗑️</span>
                                हटाएं
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {shopInventory.length === 0 && (
            <div className="product-list-container">
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-title">{t('emptyInventory')}</div>
                <div className="empty-state-message">
                  {t('emptyInventoryMessage')}
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* Category Detail Page */
        <div className="product-detail-container">
          {currentCategoryData && (
            <>
              {/* Category Header */}
              <div className="product-detail-header">
                <div className="category-detail-icon">{currentCategoryData.icon}</div>
                <div className="category-detail-info">
                  <h1 className="category-detail-title">{currentCategoryData.name}</h1>
                  <p className="category-detail-desc">{currentCategoryData.description}</p>
                </div>
                <button className="back-button" onClick={handleBackToDashboard}>
                  <span>←</span>
                  {language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
                </button>
              </div>

              {/* Product Catalog */}
              {currentCategoryProducts.length > 0 ? (
                <div className="product-catalog-grid">
                  {currentCategoryProducts.map((product) => (
                    <div key={product.id} className="product-catalog-card">
                      <div className="product-catalog-image">
                        {product.icon}
                      </div>
                      <div className="product-catalog-details">
                        <h3 className="product-catalog-name">{product.name}</h3>
                        <div className="product-catalog-variants">
                          {product.variants.map((variant) => (
                            <div key={variant.id} className="variant-item">
                              <div className="variant-name">
                                {variant.name}
                                {variant.badge && (
                                  <span className="variant-badge">{variant.badge}</span>
                                )}
                              </div>
                              <div className="variant-price">₹{variant.price}/{variant.unit}</div>
                            </div>
                          ))}
                        </div>
                        <button 
                          className="add-to-inventory-btn"
                          onClick={() => {
                            // Add first variant by default
                            handleAddCatalogProduct(product, product.variants[0]);
                          }}
                        >
                          <span>+</span>
                          इन्वेंट्री में जोड़ें
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-category-state">
                  <div className="empty-category-icon">{currentCategoryData.icon}</div>
                  <div className="empty-category-title">इस श्रेणी में कोई उत्पाद नहीं</div>
                  <div className="empty-category-message">
                    {currentCategoryData.name} श्रेणी में अभी उत्पाद उपलब्ध नहीं हैं। जल्द ही और उत्पाद जोड़े जाएंगे।
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Multi-Category Modal */}
      {showMultiCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">
                <span>📦</span>
                Multi-Category Products
              </h2>
              <p className="modal-subtitle">
                Add essential grocery items to your shop inventory
              </p>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Product Grid */}
              <div className="product-grid">
                {multiCategoryProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    {/* Product Image */}
                    <div className="product-image">
                      {product.icon}
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      
                      {/* Product Form */}
                      <div className="product-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Price (₹)</label>
                            <input
                              type="number"
                              className="form-input-small"
                              placeholder={`Per ${product.unit}`}
                              value={product.price}
                              onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                              type="number"
                              className="form-input-small"
                              placeholder={`In ${product.unit}s`}
                              value={product.quantity}
                              onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <button 
                          className={`add-product-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
                          onClick={() => handleAddProduct(product.id)}
                        >
                          {addedProducts.has(product.id) ? (
                            <>
                              <span>✓</span>
                              Added
                            </>
                          ) : (
                            <>
                              <span>+</span>
                              Add Product
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="footer-info">
                {addedProducts.size > 0 && (
                  <span>{addedProducts.size} product(s) ready to save</span>
                )}
              </div>
              <div className="footer-actions">
                <button className="btn-close" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveAll}
                  disabled={addedProducts.size === 0}
                >
                  Save All Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
