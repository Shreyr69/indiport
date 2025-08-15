// Mock data for IndiPort B2B Marketplace

export interface Product {
  id: string;
  title: string;
  price: number;
  minOrder: number;
  unit: string;
  image: string;
  category: string;
  seller: {
    id: string;
    name: string;
    location: string;
    rating: number;
    verified: boolean;
  };
  description: string;
  specifications: Record<string, string>;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface RFQ {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  targetPrice: number;
  message: string;
  status: 'pending' | 'responded' | 'negotiating' | 'closed';
  createdAt: string;
  responses?: {
    sellerId: string;
    sellerName: string;
    price: number;
    message: string;
    createdAt: string;
  }[];
}

export interface Order {
  id: string;
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
    seller: string;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  customization?: string;
}

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'Smartphone', productCount: 2450 },
  { id: '2', name: 'Machinery', icon: 'Settings', productCount: 1820 },
  { id: '3', name: 'Textiles', icon: 'Shirt', productCount: 3200 },
  { id: '4', name: 'Chemicals', icon: 'Beaker', productCount: 890 },
  { id: '5', name: 'Food & Agriculture', icon: 'Wheat', productCount: 1560 },
  { id: '6', name: 'Automotive', icon: 'Car', productCount: 970 },
  { id: '7', name: 'Construction', icon: 'HardHat', productCount: 1200 },
  { id: '8', name: 'Medical Equipment', icon: 'HeartPulse', productCount: 650 },
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    title: 'Industrial LED Light Fixtures - 100W High Bay',
    price: 89.99,
    minOrder: 50,
    unit: 'pieces',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'Electronics',
    seller: {
      id: 's1',
      name: 'Guangzhou Lighting Co.',
      location: 'Guangzhou, China',
      rating: 4.8,
      verified: true,
    },
    description: 'High-quality industrial LED light fixtures suitable for warehouses, factories, and commercial spaces. Energy-efficient with 10-year warranty.',
    specifications: {
      'Power': '100W',
      'Voltage': '110-277V',
      'Luminous Flux': '13,000 lm',
      'Color Temperature': '5000K',
      'IP Rating': 'IP65',
      'Warranty': '10 years'
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606838494059-68b5ad04b89d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '2',
    title: 'Hydraulic Press Machine - 200 Ton Capacity',
    price: 15000,
    minOrder: 1,
    unit: 'units',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=400&fit=crop',
    category: 'Machinery',
    seller: {
      id: 's2',
      name: 'Mumbai Heavy Industries',
      location: 'Mumbai, India',
      rating: 4.6,
      verified: true,
    },
    description: 'Heavy-duty hydraulic press machine for metal forming, stamping, and industrial applications. Built with precision engineering.',
    specifications: {
      'Capacity': '200 Tons',
      'Stroke': '600mm',
      'Daylight': '900mm',
      'Motor Power': '7.5 kW',
      'Weight': '5000 kg',
      'Warranty': '2 years'
    },
    images: [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '3',
    title: 'Organic Cotton Fabric - Premium Quality',
    price: 12.50,
    minOrder: 1000,
    unit: 'meters',
    image: 'https://images.unsplash.com/photo-1586769252836-4d996ccd9bef?w=400&h=400&fit=crop',
    category: 'Textiles',
    seller: {
      id: 's3',
      name: 'Istanbul Textile Mills',
      location: 'Istanbul, Turkey',
      rating: 4.9,
      verified: true,
    },
    description: 'Premium organic cotton fabric, GOTS certified. Perfect for sustainable fashion and textile manufacturing.',
    specifications: {
      'Material': '100% Organic Cotton',
      'Weight': '180 GSM',
      'Width': '150cm',
      'Certification': 'GOTS Certified',
      'Color': 'Natural/Bleached',
      'Shrinkage': '<3%'
    },
    images: [
      'https://images.unsplash.com/photo-1586769252836-4d996ccd9bef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606838494059-68b5ad04b89d?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '4',
    title: 'Smartphone Display Screens - AMOLED 6.5"',
    price: 45.99,
    minOrder: 100,
    unit: 'pieces',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'Electronics',
    seller: {
      id: 's4',
      name: 'Shenzhen Display Tech',
      location: 'Shenzhen, China',
      rating: 4.7,
      verified: true,
    },
    description: 'High-resolution AMOLED display screens for smartphone manufacturing. Compatible with major brands.',
    specifications: {
      'Size': '6.5 inches',
      'Resolution': '2400 x 1080',
      'Technology': 'AMOLED',
      'Touch': 'Capacitive Multi-touch',
      'Brightness': '500 nits',
      'Warranty': '1 year'
    },
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606838494059-68b5ad04b89d?w=800&h=600&fit=crop'
    ]
  }
];

// Mock RFQs
export const mockRFQs: RFQ[] = [
  {
    id: 'rfq1',
    productId: '1',
    productTitle: 'Industrial LED Light Fixtures - 100W High Bay',
    quantity: 500,
    targetPrice: 75,
    message: 'Looking for bulk order with customization options. Need faster delivery.',
    status: 'responded',
    createdAt: '2024-01-15',
    responses: [
      {
        sellerId: 's1',
        sellerName: 'Guangzhou Lighting Co.',
        price: 78,
        message: 'We can offer $78 per unit for 500+ pieces with 2-week delivery.',
        createdAt: '2024-01-16'
      }
    ]
  },
  {
    id: 'rfq2',
    productId: '2',
    productTitle: 'Hydraulic Press Machine - 200 Ton Capacity',
    quantity: 2,
    targetPrice: 14000,
    message: 'Need installation and training included.',
    status: 'pending',
    createdAt: '2024-01-20'
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order1',
    items: [
      {
        productId: '1',
        productTitle: 'Industrial LED Light Fixtures',
        quantity: 100,
        price: 89.99,
        seller: 'Guangzhou Lighting Co.'
      }
    ],
    total: 8999,
    status: 'shipped',
    orderDate: '2024-01-10',
    estimatedDelivery: '2024-01-25'
  },
  {
    id: 'order2',
    items: [
      {
        productId: '3',
        productTitle: 'Organic Cotton Fabric',
        quantity: 2000,
        price: 12.50,
        seller: 'Istanbul Textile Mills'
      }
    ],
    total: 25000,
    status: 'delivered',
    orderDate: '2024-01-05',
    estimatedDelivery: '2024-01-20'
  }
];

// Mock User Data
export const mockUsers = {
  buyers: [
    { id: 'b1', name: 'John Smith', email: 'john@example.com', company: 'Tech Solutions Inc.', status: 'active', joinDate: '2023-06-15' },
    { id: 'b2', name: 'Sarah Johnson', email: 'sarah@example.com', company: 'Global Manufacturing', status: 'active', joinDate: '2023-08-22' },
    { id: 'b3', name: 'Mike Chen', email: 'mike@example.com', company: 'Chen Enterprises', status: 'pending', joinDate: '2024-01-10' }
  ],
  sellers: [
    { id: 's1', name: 'Guangzhou Lighting Co.', email: 'contact@gzlighting.com', location: 'China', status: 'verified', joinDate: '2022-03-10' },
    { id: 's2', name: 'Mumbai Heavy Industries', email: 'info@mhi.com', location: 'India', status: 'verified', joinDate: '2022-07-15' },
    { id: 's3', name: 'Istanbul Textile Mills', email: 'sales@itm.com', location: 'Turkey', status: 'pending', joinDate: '2024-01-05' }
  ]
};