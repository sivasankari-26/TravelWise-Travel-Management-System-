export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export const isValidPhone = (value) => /^[6-9]\d{9}$/.test(String(value || '').trim());

export function validateRequired(fields) {
  const errors = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      errors[key] = 'This field is required.';
    }
  });
  return errors;
}
