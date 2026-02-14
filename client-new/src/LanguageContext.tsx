import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'hindi' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  hindi: {
    appTitle: 'Local Mart',
    subtitle: 'आपका अपना ग्रोसरी स्टोर',
    location: 'Delivering near to yashwant smart city sterling heights',
    searchPlaceholder: 'Search for vegetables, fruits, groceries...',
    todaysOffer: 'आज का ऑफर',
    offerText: 'सभी सब्ज़ियों पर 20% की छूट',
    offerTimer: 'केवल 2 घंटे बाकी',
    vegetables: 'सब्ज़ियाँ',
    fruits: 'फल',
    dailyEssentials: 'दैनिक एसेंशयल्स',
    seeAll: 'सभी देखें →',
    yourCart: 'आपका कार्ट',
    cartEmpty: 'कार्ट खाली है',
    total: 'कुल:',
    paymentMethod: 'भुगतान का तरीका',
    cod: 'कैश ऑन डिलवरी',
    online: 'ऑनलाइन पेमेंट',
    upi: 'यूपीआई',
    wallet: 'वॉलेट',
    checkout: 'ऑर्डर करें',
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
    // Weights
    kg1: '1 किग्रा',
    kg2: '2 किग्रा',
    g500: '500 ग्राम',
    dozen1: '1 दर्जन'
  },
  english: {
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
    yourCart: 'Your Cart',
    cartEmpty: 'Cart is Empty',
    total: 'Total:',
    paymentMethod: 'Payment Method',
    cod: 'Cash on Delivery',
    online: 'Card Payment',
    upi: 'UPI',
    wallet: 'Wallet',
    checkout: 'Checkout',
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
    // Weights
    kg1: '1 kg',
    kg2: '2 kg',
    g500: '500 g',
    dozen1: '1 dozen'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hindi');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.hindi] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
