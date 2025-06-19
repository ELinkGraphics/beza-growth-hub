
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface ValidationInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  validationRules?: ValidationRule[];
  required?: boolean;
  className?: string;
}

export const ValidationInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  validationRules = [],
  required = false,
  className = ''
}: ValidationInputProps) => {
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateInput = (inputValue: string) => {
    const newErrors: string[] = [];
    
    if (required && !inputValue.trim()) {
      newErrors.push(`${label} is required`);
    }
    
    validationRules.forEach(rule => {
      if (inputValue && !rule.test(inputValue)) {
        newErrors.push(rule.message);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (touched) {
      validateInput(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validateInput(value);
  };

  const hasErrors = touched && errors.length > 0;
  const isValid = touched && errors.length === 0 && value.trim() !== '';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`pr-10 ${
            hasErrors 
              ? 'border-red-500 focus:border-red-500' 
              : isValid 
                ? 'border-green-500 focus:border-green-500' 
                : ''
          }`}
        />
        
        {touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasErrors ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
