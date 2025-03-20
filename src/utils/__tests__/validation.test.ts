
import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateBio, 
  getPasswordStrength 
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('name.surname@domain.co.uk')).toBe(true);
      expect(validateEmail('user123@server-name.extension')).toBe(true);
    });

    it('rejects incorrect email formats', () => {
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts valid passwords', () => {
      expect(validatePassword('Password123')).toBe(true);
      expect(validatePassword('StrongP4ssw0rd')).toBe(true);
    });

    it('rejects invalid passwords', () => {
      expect(validatePassword('password')).toBe(false); // No uppercase or numbers
      expect(validatePassword('PASSWORD123')).toBe(false); // No lowercase
      expect(validatePassword('Password')).toBe(false); // No numbers
      expect(validatePassword('Pass1')).toBe(false); // Too short
    });
  });

  describe('validateName', () => {
    it('accepts names with 2 or more characters', () => {
      expect(validateName('Jo')).toBe(true);
      expect(validateName('John')).toBe(true);
      expect(validateName('  John  ')).toBe(true); // Trims spaces
    });

    it('rejects names with less than 2 characters', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('J')).toBe(false);
      expect(validateName('  J  ')).toBe(false); // Trims spaces
    });
  });

  describe('validateBio', () => {
    it('accepts bios within the length limit', () => {
      expect(validateBio('Short bio')).toBe(true);
      expect(validateBio('A'.repeat(300))).toBe(true);
    });

    it('rejects bios exceeding the length limit', () => {
      expect(validateBio('A'.repeat(301))).toBe(false);
    });

    it('respects custom max length', () => {
      expect(validateBio('A'.repeat(50), 100)).toBe(true);
      expect(validateBio('A'.repeat(110), 100)).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('correctly identifies weak passwords', () => {
      expect(getPasswordStrength('short')).toBe('weak');
      expect(getPasswordStrength('onlyletters')).toBe('weak');
    });

    it('correctly identifies medium passwords', () => {
      expect(getPasswordStrength('Password1')).toBe('medium');
      expect(getPasswordStrength('password123')).toBe('medium');
    });

    it('correctly identifies strong passwords', () => {
      expect(getPasswordStrength('StrongP4ssw0rd!')).toBe('strong');
      expect(getPasswordStrength('SuperSecurePassword123!')).toBe('strong');
    });
  });
});
