import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
  hasError?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper = ({ steps, currentStep, className = '' }: StepperProps) => {
  return (
    <div className={`w-full ${className}`}>
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
              {/* Línea conectora */}
              {stepIdx !== steps.length - 1 && (
                <div 
                  className={`absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} 
                  aria-hidden="true" 
                />
              )}
              
              <div className="relative flex items-start group">
                <span className="h-9 flex items-center">
                  <span
                    className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      currentStep > step.id
                        ? 'bg-blue-600 text-white'
                        : currentStep === step.id
                        ? step.hasError
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-600 text-white'
                        : step.hasError
                        ? 'bg-red-100 dark:bg-red-900 border-2 border-red-500 text-red-600 dark:text-red-400'
                        : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </span>
                </span>
                <span className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Stepper;