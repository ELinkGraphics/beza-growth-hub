
export const emailValidation = {
  test: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  message: 'Please enter a valid email address'
};

export const passwordValidation = {
  minLength: {
    test: (password: string) => password.length >= 6,
    message: 'Password must be at least 6 characters long'
  },
  hasUppercase: {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Password must contain at least one uppercase letter'
  },
  hasLowercase: {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Password must contain at least one lowercase letter'
  },
  hasNumber: {
    test: (password: string) => /\d/.test(password),
    message: 'Password must contain at least one number'
  }
};

export const phoneValidation = {
  test: (phone: string) => /^\+?[\d\s\-\(\)]{10,}$/.test(phone),
  message: 'Please enter a valid phone number'
};

export const nameValidation = {
  test: (name: string) => name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name),
  message: 'Name must be at least 2 characters and contain only letters'
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"']/g, '');
};

export const validateForm = (data: Record<string, any>, rules: Record<string, any[]>): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    const fieldErrors: string[] = [];
    
    fieldRules.forEach(rule => {
      if (!rule.test(value)) {
        fieldErrors.push(rule.message);
      }
    });
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return errors;
};
