import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  supportedLanguages: { code: Language; name: string; flag: string }[];
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    es: 'Inicio',
    fr: 'Accueil',
    de: 'Startseite',
    zh: '首页'
  },
  'nav.products': {
    en: 'Products',
    hi: 'उत्पाद',
    es: 'Productos',
    fr: 'Produits',
    de: 'Produkte',
    zh: '产品'
  },
  'nav.cart': {
    en: 'Cart',
    hi: 'कार्ट',
    es: 'Carrito',
    fr: 'Panier',
    de: 'Warenkorb',
    zh: '购物车'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    es: 'Panel',
    fr: 'Tableau de bord',
    de: 'Dashboard',
    zh: '仪表板'
  },

  // Common Actions
  'common.search': {
    en: 'Search',
    hi: 'खोजें',
    es: 'Buscar',
    fr: 'Rechercher',
    de: 'Suchen',
    zh: '搜索'
  },
  'common.add_to_cart': {
    en: 'Add to Cart',
    hi: 'कार्ट में जोड़ें',
    es: 'Añadir al carrito',
    fr: 'Ajouter au panier',
    de: 'In den Warenkorb',
    zh: '添加到购物车'
  },
  'common.loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    es: 'Cargando...',
    fr: 'Chargement...',
    de: 'Laden...',
    zh: '加载中...'
  },
  'common.save': {
    en: 'Save',
    hi: 'सेव करें',
    es: 'Guardar',
    fr: 'Enregistrer',
    de: 'Speichern',
    zh: '保存'
  },
  'common.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें',
    es: 'Cancelar',
    fr: 'Annuler',
    de: 'Abbrechen',
    zh: '取消'
  },

  // Product Listings
  'products.title': {
    en: 'Product Listings',
    hi: 'उत्पाद सूची',
    es: 'Listado de productos',
    fr: 'Liste des produits',
    de: 'Produktliste',
    zh: '产品列表'
  },
  'products.search_placeholder': {
    en: 'Search products or categories...',
    hi: 'उत्पाद या श्रेणियां खोजें...',
    es: 'Buscar productos o categorías...',
    fr: 'Rechercher des produits ou catégories...',
    de: 'Produkte oder Kategorien suchen...',
    zh: '搜索产品或类别...'
  },
  'products.no_products': {
    en: 'No products found',
    hi: 'कोई उत्पाद नहीं मिला',
    es: 'No se encontraron productos',
    fr: 'Aucun produit trouvé',
    de: 'Keine Produkte gefunden',
    zh: '未找到产品'
  },
  'products.filters': {
    en: 'Filters',
    hi: 'फिल्टर',
    es: 'Filtros',
    fr: 'Filtres',
    de: 'Filter',
    zh: '筛选器'
  },

  // Authentication
  'auth.sign_in': {
    en: 'Sign In',
    hi: 'साइन इन करें',
    es: 'Iniciar sesión',
    fr: 'Se connecter',
    de: 'Anmelden',
    zh: '登录'
  },
  'auth.sign_up': {
    en: 'Sign Up',
    hi: 'साइन अप करें',
    es: 'Registrarse',
    fr: "S'inscrire",
    de: 'Registrieren',
    zh: '注册'
  },
  'auth.email': {
    en: 'Email',
    hi: 'ईमेल',
    es: 'Correo electrónico',
    fr: 'E-mail',
    de: 'E-Mail',
    zh: '电子邮件'
  },
  'auth.password': {
    en: 'Password',
    hi: 'पासवर्ड',
    es: 'Contraseña',
    fr: 'Mot de passe',
    de: 'Passwort',
    zh: '密码'
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome to your dashboard',
    hi: 'आपके डैशबोर्ड में आपका स्वागत है',
    es: 'Bienvenido a tu panel',
    fr: 'Bienvenue sur votre tableau de bord',
    de: 'Willkommen in Ihrem Dashboard',
    zh: '欢迎使用您的仪表板'
  },
  'dashboard.analytics': {
    en: 'Analytics',
    hi: 'विश्लेषण',
    es: 'Analíticas',
    fr: 'Analyses',
    de: 'Analysen',
    zh: '分析'
  },
  'dashboard.orders': {
    en: 'Orders',
    hi: 'ऑर्डर',
    es: 'Pedidos',
    fr: 'Commandes',
    de: 'Bestellungen',
    zh: '订单'
  },

  // Payment
  'payment.total': {
    en: 'Total',
    hi: 'कुल',
    es: 'Total',
    fr: 'Total',
    de: 'Gesamt',
    zh: '总计'
  },
  'payment.secure': {
    en: 'Secure Payment',
    hi: 'सुरक्षित भुगतान',
    es: 'Pago seguro',
    fr: 'Paiement sécurisé',
    de: 'Sichere Zahlung',
    zh: '安全支付'
  },
  'payment.processing': {
    en: 'Processing...',
    hi: 'प्रसंस्करण...',
    es: 'Procesando...',
    fr: 'Traitement...',
    de: 'Verarbeitung...',
    zh: '处理中...'
  }
};

const supportedLanguages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (supportedLanguages.find(lang => lang.code === browserLanguage)) {
        setLanguage(browserLanguage);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        supportedLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;