// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateForm = (schema, data) => {
  const errors = {};
  let isValid = true;

  if (schema.email) {
    if (!validateRequired(data.email)) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
  }

  if (schema.password) {
    if (!validateRequired(data.password)) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(data.password)) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
  }

  if (schema.name) {
    if (!validateRequired(data.name)) {
      errors.name = 'Name is required';
      isValid = false;
    }
  }

  if (schema.confirmPassword) {
    if (!validateRequired(data.confirmPassword)) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
  }

  return {
    success: isValid,
    errors
  };
};

export const loginSchema = {
  email: true,
  password: true
};

export const signupSchema = {
  name: true,
  email: true,
  password: true,
  confirmPassword: true
};
