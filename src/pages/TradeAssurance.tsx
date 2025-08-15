import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Clock, RefreshCw, Users, Award, Lock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TradeAssurance = () => {
  const navigate = useNavigate();
  const protectionFeatures = [
    {
      icon: Shield,
      title: "Payment Protection",
      description: "Your payments are held securely until you confirm receipt of goods matching your order specifications."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "All products must meet specified quality standards. Disputes are resolved through our expert mediation team."
    },
    {
      icon: Clock,
      title: "Delivery Guarantee",
      description: "Get full refunds if products are not delivered within the agreed timeframe."
    },
    {
      icon: RefreshCw,
      title: "Return & Refund",
      description: "Easy return process and guaranteed refunds for products that don't match specifications."
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Place Order",
      description: "Choose Trade Assurance payment when placing your order with verified suppliers."
    },
    {
      step: "2",
      title: "Payment Hold",
      description: "Your payment is securely held by IndiPort until delivery confirmation."
    },
    {
      step: "3",
      title: "Product Shipped",
      description: "Supplier ships your order with tracking information provided."
    },
    {
      step: "4",
      title: "Confirm Receipt",
      description: "Inspect products and confirm receipt through your dashboard."
    },
    {
      step: "5",
      title: "Payment Release",
      description: "Payment is released to supplier after your confirmation or automatic release."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Verified Suppliers",
      description: "All Trade Assurance suppliers undergo rigorous verification including business licenses and quality assessments."
    },
    {
      icon: Award,
      title: "Quality Commitment",
      description: "Suppliers must maintain high quality standards and customer satisfaction ratings to remain in the program."
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      description: "Advanced encryption and secure payment processing ensure your financial information is protected."
    },
    {
      icon: FileText,
      title: "Contract Protection",
      description: "All orders are backed by binding contracts that protect both buyer and supplier interests."
    }
  ];

  const coverageAmounts = [
    { level: "Basic", amount: "$50,000", color: "bg-blue-100 text-blue-800" },
    { level: "Premium", amount: "$200,000", color: "bg-green-100 text-green-800" },
    { level: "Gold", amount: "$500,000", color: "bg-yellow-100 text-yellow-800" },
    { level: "Platinum", amount: "$1,000,000", color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="heading-primary mb-4">Trade Assurance</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Shop with confidence on IndiPort. Our Trade Assurance program protects your orders 
            from payment to delivery, ensuring you receive quality products as described.
          </p>
          <Button 
            size="lg" 
            className="btn-primary"
            onClick={() => {
              const element = document.getElementById('how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn How It Works
          </Button>
        </div>

        {/* Protection Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Complete Protection Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protectionFeatures.map((feature, index) => (
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
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Trade Assurance Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-16 bg-border ml-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Levels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Coverage Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageAmounts.map((coverage, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6 text-center">
                  <Badge className={coverage.color + " mb-4"}>{coverage.level}</Badge>
                  <h3 className="text-2xl font-bold mb-2">{coverage.amount}</h3>
                  <p className="text-muted-foreground text-sm">Maximum coverage per order</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6">
            Coverage level is determined by supplier verification status and order history
          </p>
        </section>

        {/* Additional Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Trade Assurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Is Trade Assurance free?</h4>
                  <p className="text-muted-foreground">Yes, Trade Assurance is completely free for buyers. There are no additional fees for using this protection service.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How long is my payment held?</h4>
                  <p className="text-muted-foreground">Payments are held until you confirm receipt or up to 60 days after the latest delivery date, after which payments are automatically released.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if there's a dispute?</h4>
                  <p className="text-muted-foreground">Our dispute resolution team will mediate between you and the supplier. You can provide evidence and we'll make a fair decision based on the order terms.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Are all suppliers covered?</h4>
                  <p className="text-muted-foreground">Only verified suppliers who meet our quality standards are eligible for Trade Assurance. Look for the Trade Assurance badge on product listings.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="card-elevated bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Trade with Confidence?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of buyers who trust IndiPort's Trade Assurance for their business purchases.
                Start shopping with complete peace of mind today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-primary"
                  onClick={() => navigate('/products')}
                >
                  Browse Protected Products
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact-us')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TradeAssurance;