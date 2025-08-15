import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Users, Award, TrendingUp, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with suppliers and buyers from around the world on our international B2B marketplace."
    },
    {
      icon: Shield,
      title: "Trade Assurance",
      description: "Secure transactions with our comprehensive trade protection and verification system."
    },
    {
      icon: Users,
      title: "Verified Suppliers",
      description: "All our suppliers undergo rigorous verification to ensure quality and reliability."
    },
    {
      icon: Award,
      title: "Quality Products",
      description: "Discover high-quality products across various categories with detailed specifications."
    },
    {
      icon: TrendingUp,
      title: "Growing Network",
      description: "Join thousands of businesses already trading successfully on our platform."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize customer satisfaction with 24/7 support and dispute resolution."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="heading-primary mb-4">About IndiPort</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            IndiPort is India's leading B2B marketplace, connecting businesses worldwide with 
            high-quality suppliers and buyers. We're committed to facilitating secure, 
            efficient, and profitable international trade.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-lg">
              To empower businesses of all sizes to access global markets through a secure, 
              transparent, and user-friendly B2B platform that connects verified suppliers 
              with trusted buyers worldwide.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="card-elevated hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Stats */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">10,000+</h3>
                <p className="text-muted-foreground">Verified Suppliers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">50,000+</h3>
                <p className="text-muted-foreground">Active Buyers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">1M+</h3>
                <p className="text-muted-foreground">Products Listed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">150+</h3>
                <p className="text-muted-foreground">Countries Served</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-muted-foreground">
                Founded in 2020, IndiPort emerged from a vision to bridge the gap between 
                Indian manufacturers and global buyers. Recognizing the potential of Indian 
                products in international markets, our founders set out to create a platform 
                that would make global trade accessible to businesses of all sizes.
              </p>
              <p className="text-muted-foreground">
                Today, IndiPort has grown into one of India's most trusted B2B marketplaces, 
                facilitating millions of dollars in trade volume annually. Our platform 
                serves as a gateway for Indian businesses to reach global markets while 
                helping international buyers discover high-quality, competitively-priced 
                products from India.
              </p>
              <p className="text-muted-foreground">
                We continue to innovate and expand our services, adding new features like 
                trade assurance, verified supplier programs, and AI-powered matching to 
                enhance the trading experience for all our users.
              </p>
              <div className="text-center mt-8">
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="btn-primary mr-4"
                >
                  Join IndiPort Today
                </Button>
                <Button 
                  onClick={() => navigate('/contact-us')} 
                  variant="outline"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;