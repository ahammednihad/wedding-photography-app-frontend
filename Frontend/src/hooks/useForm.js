import { useState, useCallback } from "react";
import { validateForm } from "../utils/validation";

// Custom hook for form management
export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationSchema[name]) {
      const field = validationSchema[name];
      const value = values[name];
      
      if (field.required && !value) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${field.label || name} is required`,
        }));
      }
    }
  }, [values, validationSchema]);

  const validate = useCallback(() => {
    if (Object.keys(validationSchema).length === 0) {
      return { isValid: true, errors: {} };
    }
    
    const result = validateForm(validationSchema, values);
    setErrors(result.errors);
    return result;
  }, [values, validationSchema]);

  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      const result = validate();
      if (result.isValid) {
        onSubmit(values);
      }
    };
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setFieldValue,
    setValues,
  };
};
