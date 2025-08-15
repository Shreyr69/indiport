import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLiveChat = () => {
    toast({
      title: "Live Chat",
      description: "Connecting you to our support team...",
    });
  };
  
  const handleEmailSupport = () => {
    navigate('/contact-us');
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on IndiPort?",
          answer: "Click on 'Sign Up' in the top right corner, choose your account type (Buyer/Seller), and fill in your business details. You'll receive a verification email to activate your account."
        },
        {
          question: "What documents do I need for seller verification?",
          answer: "You'll need business registration documents, tax identification, and proof of address. Our verification team will review these within 2-3 business days."
        },
        {
          question: "How do I start buying/selling on the platform?",
          answer: "After verification, buyers can browse products and send RFQs. Sellers can list products and respond to buyer inquiries through their dashboard."
        }
      ]
    },
    {
      category: "Orders & Payments",
      questions: [
        {
          question: "What payment methods are accepted?",
          answer: "We accept bank transfers, credit cards, and digital payment methods through our secure payment gateway powered by Razorpay."
        },
        {
          question: "How does trade assurance work?",
          answer: "Trade assurance protects your payments until you confirm receipt of goods. Funds are held securely and released only after successful delivery confirmation."
        },
        {
          question: "Can I cancel my order?",
          answer: "Orders can be cancelled before the seller confirms shipment. After shipment, cancellation depends on the seller's return policy."
        }
      ]
    },
    {
      category: "Products & Suppliers",
      questions: [
        {
          question: "How are suppliers verified?",
          answer: "All suppliers undergo document verification, business license checks, and quality assessments. Verified suppliers display a 'Verified' badge."
        },
        {
          question: "How do I request a quotation (RFQ)?",
          answer: "Click 'Request Quote' on any product page, specify your requirements, and submit. Suppliers will respond with customized quotes."
        },
        {
          question: "What if I receive defective products?",
          answer: "Contact our support team immediately with photos and details. We'll work with the supplier to resolve the issue through our dispute resolution process."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+91-800-123-4567",
      hours: "Mon-Fri, 9 AM - 6 PM IST"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed assistance via email",
      contact: "support@indiport.com",
      hours: "24/7 - Response within 4 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant help through chat",
      contact: "Available on website",
      hours: "Mon-Fri, 9 AM - 6 PM IST"
    }
  ];

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-primary mb-4">Help Center</h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              {filteredFAQs.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, questionIndex) => (
                        <AccordionItem key={questionIndex} value={`${categoryIndex}-${questionIndex}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
              
              {filteredFAQs.length === 0 && searchTerm && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No results found for "{searchTerm}". Try different keywords or contact our support team.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <Card key={index} className="card-elevated">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{option.description}</p>
                    <p className="font-medium text-primary mb-2">{option.contact}</p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {option.hours}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Support Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Can't find what you're looking for? Our dedicated support team is here to help you with any questions or issues you may have.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleLiveChat}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Live Chat
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleEmailSupport}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;