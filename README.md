# IndiPort - Global B2B Marketplace

A modern, responsive B2B marketplace platform built with React, TypeScript, and Tailwind CSS. IndiPort connects buyers and suppliers worldwide, providing a comprehensive solution for global trade and commerce.

![IndiPort Banner](https://via.placeholder.com/1200x400/1e40af/ffffff?text=IndiPort+B2B+Marketplace)

## 🌟 Features

### For Buyers
- **Global Product Discovery**: Browse millions of products from verified suppliers worldwide
- **Advanced Search & Filters**: Find exactly what you need with powerful search capabilities
- **Supplier Verification**: All suppliers are verified and quality-assured
- **Secure Transactions**: End-to-end secure payment processing
- **Real-time Tracking**: Track your orders from purchase to delivery
- **RFQ Management**: Create and manage Request for Quotations

### For Suppliers
- **Product Management**: Easy-to-use dashboard for managing product listings
- **Order Management**: Track and fulfill orders efficiently
- **Analytics Dashboard**: Monitor performance and sales metrics
- **Customer Communication**: Direct messaging with buyers
- **Payment Processing**: Secure payment collection and management

### Platform Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Multi-language Support**: Internationalization ready
- **Real-time Notifications**: Stay updated with instant notifications
- **Advanced Analytics**: Comprehensive business insights
- **Trade Assurance**: Built-in protection for secure transactions

## 🚀 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### State Management & Data
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Backend Integration
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Razorpay** - Payment processing integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/indiport-marketplace.git
   cd indiport-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Main navigation header
│   ├── HeroCarousel.tsx # Hero section carousel
│   └── TestimonialsCarousel.tsx # Testimonials section
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication context
│   └── LanguageContext.tsx # Internationalization context
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hooks
│   ├── useCart.ts      # Shopping cart management
│   └── useProducts.ts  # Product data management
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── ProductListings.tsx # Product catalog
│   ├── ProductDetails.tsx # Product detail page
│   └── ...             # Other pages
├── lib/                # Utility libraries
├── data/               # Mock data and constants
└── integrations/       # Third-party integrations
    └── supabase/       # Supabase configuration
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#1e40af` - Main brand color
- **Accent Gold**: `#fbbf24` - Highlight and CTA elements
- **Neutral Grays**: Various shades for text and backgrounds
- **Success Green**: `#16a34a` - Success states
- **Warning Orange**: `#ea580c` - Warning states
- **Error Red**: `#dc2626` - Error states

### Typography
- **Font Family**: Inter (Apple-inspired modern sans-serif)
- **Responsive Scaling**: Text sizes adapt to screen sizes
- **Optimized Readability**: Proper contrast and spacing

### Components
- **Consistent Design**: All components follow the same design language
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Responsive**: Mobile-first design approach

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing (when implemented)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server for SPA routing

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | Yes |
| `VITE_APP_URL` | Application URL | No |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.indiport.com](https://docs.indiport.com)
- **Email**: support@indiport.com
- **Discord**: [Join our community](https://discord.gg/indiport)
- **Issues**: [GitHub Issues](https://github.com/your-username/indiport-marketplace/issues)

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Supabase** for the backend infrastructure
- **React Team** for the amazing framework
- **Vite Team** for the fast build tool

---

**Built with ❤️ by the IndiPort Team**

*Connecting global businesses, one transaction at a time.*
