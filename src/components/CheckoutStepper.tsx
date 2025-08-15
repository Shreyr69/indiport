import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutStepperProps {
  currentStep: number;
  steps: string[];
}

export const CheckoutStepper = ({ currentStep, steps }: CheckoutStepperProps) => {
  return (
    <div className="mb-8">
      {/* Progress bubbles and connecting line */}
      <div className="relative flex justify-between mb-4">
        {/* Background connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -translate-y-1/2" />
        
        {/* Progress connecting line */}
        <div 
          className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2"
          style={{ 
            width: currentStep === 0 ? '0%' : `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
        />
        
        {/* Step bubbles */}
        {steps.map((step, index) => (
          <div key={step} className="relative z-10">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 bg-background",
                index < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary text-primary bg-background"
                  : "border-muted-foreground text-muted-foreground bg-background"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Step labels below bubbles */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="text-center">
            <span
              className={cn(
                "text-sm font-medium",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};