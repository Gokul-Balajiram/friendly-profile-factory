
// Email regex pattern for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password must be at least 8 characters with at least one number, one uppercase and one lowercase letter
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateBio = (bio: string, maxLength: number = 300): boolean => {
  return bio.trim().length <= maxLength;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  
  let score = 0;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
};
