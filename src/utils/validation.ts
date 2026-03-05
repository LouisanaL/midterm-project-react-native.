// src/utils/validation.ts
import { ApplicationForm, ValidationErrors } from '../types';

export const validateApplicationForm = (form: ApplicationForm): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters.';
  } else if (!/^[a-zA-Z\s'-]+$/.test(form.name.trim())) {
    errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  } else if (form.email.trim().length > 254) {
    errors.email = 'Email address is too long.';
  }

  // Contact number validation
  if (!form.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required.';
  } else if (!/^[0-9+\-\s()]+$/.test(form.contactNumber.trim())) {
    errors.contactNumber = 'Contact number can only contain digits, +, -, spaces, and parentheses.';
  } else if (form.contactNumber.replace(/\D/g, '').length < 7) {
    errors.contactNumber = 'Contact number must have at least 7 digits.';
  } else if (form.contactNumber.replace(/\D/g, '').length > 15) {
    errors.contactNumber = 'Contact number must not exceed 15 digits.';
  }

  // Why should we hire you validation
  if (!form.whyHireYou.trim()) {
    errors.whyHireYou = 'This field is required.';
  } else if (form.whyHireYou.trim().length < 20) {
    errors.whyHireYou = 'Please provide at least 20 characters.';
  } else if (form.whyHireYou.trim().length > 1000) {
    errors.whyHireYou = 'Response must not exceed 1000 characters.';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};