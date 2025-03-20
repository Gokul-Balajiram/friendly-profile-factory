
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getProfiles, 
  getCurrentUser, 
  createProfile, 
  updateProfile, 
  deleteProfile 
} from '../storage';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('getProfiles', () => {
    it('returns an empty array when no profiles exist', () => {
      const profiles = getProfiles();
      expect(profiles).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('edu_profiles');
    });

    it('returns profiles from localStorage when they exist', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com' }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const profiles = getProfiles();
      expect(profiles).toEqual(mockProfiles);
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no current user exists', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
    });

    it('returns the current user profile when it exists', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com' },
        { id: '2', name: 'Jane', email: 'jane@example.com' }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('2'));
      
      const user = getCurrentUser();
      expect(user).toEqual(mockProfiles[1]);
    });
  });

  describe('createProfile', () => {
    it('creates a new profile and sets it as current user', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com' }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const newProfile = {
        name: 'Jane',
        email: 'jane@example.com',
        bio: '',
        imageUrl: '',
        skills: [],
        isPrivate: false,
        following: []
      };
      
      // Mock Math.random to return a predictable value for the ID
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);
      
      const createdProfile = createProfile(newProfile);
      
      // Restore original Math.random
      Math.random = originalRandom;
      
      expect(createdProfile.name).toBe('Jane');
      expect(createdProfile.email).toBe('jane@example.com');
      expect(createdProfile.id).toBeDefined();
      
      // Check localStorage updates
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
      
      // Check if current user was set
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'edu_current_user',
        JSON.stringify(createdProfile.id)
      );
    });

    it('throws an error when email already exists', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com' }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const newProfile = {
        name: 'Jane',
        email: 'john@example.com',  // Same email as existing profile
        bio: '',
        imageUrl: '',
        skills: [],
        isPrivate: false,
        following: []
      };
      
      expect(() => createProfile(newProfile)).toThrow('Email already exists');
    });
  });
});
