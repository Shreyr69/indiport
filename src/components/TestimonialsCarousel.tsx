import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestimonialsCarousel = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Eva Jane",
      title: "Founder of Eva Jane Beauty",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      text: "As an entrepreneur who is deeply involved in the Beauty industry, I have been very devoted to creating my original products. IndiPort has been my trusted partner in this process."
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "CEO of TechFlow Solutions",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      text: "IndiPort's global network of suppliers has transformed our electronics business. The quality and reliability of their platform is unmatched in the B2B marketplace."
    },
    {
      id: 3,
      name: "Sarah Rodriguez",
      title: "Procurement Manager at GreenBuild",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      text: "Finding sustainable construction materials was a challenge until we discovered IndiPort. Their verified suppliers and quality assurance make sourcing effortless."
    },
    {
      id: 4,
      name: "David Kim",
      title: "Operations Director at FreshFood Co.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      text: "IndiPort's food and beverage suppliers have helped us expand our product line significantly. The platform's ease of use and customer support are exceptional."
    },
    {
      id: 5,
      name: "Lisa Thompson",
      title: "Founder of Artisan Textiles",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      text: "As a small business owner, IndiPort has opened up global opportunities I never thought possible. Their platform makes international trade accessible and secure."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Testimonial Cards */}
      <div className="relative overflow-hidden">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`transition-all duration-700 ease-in-out ${
              index === currentTestimonial
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 absolute inset-0 translate-x-full'
            }`}
          >
                         <div className="bg-blue-50/80 rounded-xl shadow-lg p-8 relative">
                             {/* Quote Icon - Top Left */}
               <Quote className="absolute top-6 left-6 h-8 w-8 text-blue-200" />
               
               {/* Quote Icon - Bottom Right */}
               <Quote className="absolute bottom-6 right-6 h-8 w-8 text-blue-200 transform rotate-180" />
              
              <div className="flex items-start space-x-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary-light"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                                     <p className="text-lg sm:text-xl text-gray-800 leading-relaxed mb-4 pl-8">
                     "{testimonial.text}"
                   </p>
                   
                   <div>
                     <h4 className="font-semibold text-lg text-gray-900">
                       {testimonial.name}
                     </h4>
                     <p className="text-gray-700">
                       {testimonial.title}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentTestimonial
                ? 'bg-primary scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
