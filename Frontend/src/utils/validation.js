// Validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== "";
};

export const validateDate = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Form validation helper
export const validateForm = (fields, values) => {
  const errors = {};
  
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];
    const value = values[fieldName];
    
    // Required validation
    if (field.required && !validateRequired(value)) {
      errors[fieldName] = `${field.label || fieldName} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !field.required) return;
    
    // Email validation
    if (field.type === "email" && value && !validateEmail(value)) {
      errors[fieldName] = "Please enter a valid email address";
      return;
    }
    
    // Password validation
    if (field.type === "password" && value && !validatePassword(value)) {
      errors[fieldName] = "Password must be at least 8 characters";
      return;
    }
    
    // Phone validation
    if (field.type === "tel" && value && !validatePhone(value)) {
      errors[fieldName] = "Please enter a valid phone number";
      return;
    }
    
    // Date validation
    if (field.type === "date" && value && field.futureOnly && !validateDate(value)) {
      errors[fieldName] = "Date must be today or in the future";
      return;
    }
    
    // Amount validation
    if (field.type === "number" && value && field.min && parseFloat(value) < field.min) {
      errors[fieldName] = `Value must be at least ${field.min}`;
      return;
    }
    
    // Custom validation
    if (field.validate && typeof field.validate === "function") {
      const customError = field.validate(value, values);
      if (customError) {
        errors[fieldName] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
