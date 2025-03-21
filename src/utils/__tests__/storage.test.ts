
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getProfiles, 
  getCurrentUser, 
  createProfile, 
  updateProfile, 
  deleteProfile,
  getProfileById,
  setCurrentUser,
  viewProfile,
  toggleFollow,
  isFollowing,
  getNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
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
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
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
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 },
        { id: '2', name: 'Jane', email: 'jane@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
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
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
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
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
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

  describe('updateProfile', () => {
    it('updates an existing profile', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const updatedProfile = updateProfile({
        id: '1',
        name: 'John Doe',
        bio: 'Updated bio'
      });
      
      expect(updatedProfile.name).toBe('John Doe');
      expect(updatedProfile.bio).toBe('Updated bio');
      expect(updatedProfile.email).toBe('john@example.com'); // Unchanged field
      
      // Check localStorage update
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('edu_profiles', expect.any(String));
    });
    
    it('throws an error when profile not found', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      expect(() => updateProfile({
        id: 'non-existent',
        name: 'Jane'
      })).toThrow('Profile not found');
    });
    
    it('throws an error when updating email to one that already exists', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 },
        { id: '2', name: 'Jane', email: 'jane@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      expect(() => updateProfile({
        id: '1',
        email: 'jane@example.com' // Email already exists for another profile
      })).toThrow('Email already exists');
    });
  });
  
  describe('deleteProfile', () => {
    it('deletes a profile from localStorage', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 },
        { id: '2', name: 'Jane', email: 'jane@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      deleteProfile('1');
      
      const updatedProfiles = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedProfiles.length).toBe(1);
      expect(updatedProfiles[0].id).toBe('2');
    });
    
    it('removes current user if deleting current user profile', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('1'));
      
      deleteProfile('1');
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('edu_current_user');
    });
  });
  
  describe('getProfileById', () => {
    it('returns the profile with matching id', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 },
        { id: '2', name: 'Jane', email: 'jane@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const profile = getProfileById('2');
      expect(profile?.name).toBe('Jane');
    });
    
    it('returns null when profile not found', () => {
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: 0 }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      const profile = getProfileById('non-existent');
      expect(profile).toBeNull();
    });
  });
  
  describe('viewProfile', () => {
    it('increments the view count of a profile', () => {
      const initialViewCount = 5;
      const mockProfiles = [
        { id: '1', name: 'John', email: 'john@example.com', bio: '', imageUrl: '', skills: [], isPrivate: false, following: [], followers: [], createdAt: new Date(), updatedAt: new Date(), viewCount: initialViewCount }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      
      // Mock current user
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('2'));
      
      viewProfile('1');
      
      const updatedProfiles = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedProfiles[0].viewCount).toBe(initialViewCount + 1);
    });
  });
  
  describe('toggleFollow and isFollowing', () => {
    it('follows a user when not following', () => {
      const mockProfiles = [
        { 
          id: '1', 
          name: 'John', 
          email: 'john@example.com', 
          bio: '', 
          imageUrl: '', 
          skills: [], 
          isPrivate: false, 
          following: [], 
          followers: [], 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          viewCount: 0 
        },
        { 
          id: '2', 
          name: 'Jane', 
          email: 'jane@example.com', 
          bio: '', 
          imageUrl: '', 
          skills: [], 
          isPrivate: false, 
          following: [], 
          followers: [], 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          viewCount: 0 
        }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('1'));
      
      // Mock the notification function
      const originalAddNotification = addNotification;
      global.addNotification = vi.fn();
      
      const result = toggleFollow('2');
      
      // Restore original function
      global.addNotification = originalAddNotification;
      
      expect(result).toBe(true); // Now following
      
      const updatedProfiles = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedProfiles[0].following).toContain('2'); // Current user is following target
      expect(updatedProfiles[1].followers).toContain('1'); // Target user has current user as follower
    });
    
    it('unfollows a user when already following', () => {
      const mockProfiles = [
        { 
          id: '1', 
          name: 'John', 
          email: 'john@example.com', 
          bio: '', 
          imageUrl: '', 
          skills: [], 
          isPrivate: false, 
          following: ['2'], 
          followers: [], 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          viewCount: 0 
        },
        { 
          id: '2', 
          name: 'Jane', 
          email: 'jane@example.com', 
          bio: '', 
          imageUrl: '', 
          skills: [], 
          isPrivate: false, 
          following: [], 
          followers: ['1'], 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          viewCount: 0 
        }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('1'));
      
      const result = toggleFollow('2');
      
      expect(result).toBe(false); // No longer following
      
      const updatedProfiles = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedProfiles[0].following).not.toContain('2');
      expect(updatedProfiles[1].followers).not.toContain('1');
    });
    
    it('checks if user is following another user', () => {
      const mockProfiles = [
        { 
          id: '1', 
          name: 'John', 
          email: 'john@example.com', 
          bio: '', 
          imageUrl: '', 
          skills: [], 
          isPrivate: false, 
          following: ['2'], 
          followers: [], 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          viewCount: 0 
        }
      ];
      mockLocalStorage.setItem('edu_profiles', JSON.stringify(mockProfiles));
      mockLocalStorage.setItem('edu_current_user', JSON.stringify('1'));
      
      const following = isFollowing('2');
      expect(following).toBe(true);
      
      const notFollowing = isFollowing('3');
      expect(notFollowing).toBe(false);
    });
  });
  
  describe('notification functions', () => {
    it('gets notifications for a user', () => {
      const mockNotifications = [
        { id: '1', userId: '1', message: 'Test notification 1', type: 'system' as const, read: false, createdAt: new Date() },
        { id: '2', userId: '1', message: 'Test notification 2', type: 'follow' as const, read: true, createdAt: new Date() },
        { id: '3', userId: '2', message: 'Test notification 3', type: 'view' as const, read: false, createdAt: new Date() }
      ];
      mockLocalStorage.setItem('edu_notifications', JSON.stringify(mockNotifications));
      
      const userNotifications = getNotifications('1');
      expect(userNotifications.length).toBe(2);
      expect(userNotifications[0].id).toBe('1');
      expect(userNotifications[1].id).toBe('2');
    });
    
    it('adds a new notification', () => {
      const mockNotifications = [
        { id: '1', userId: '1', message: 'Test notification', type: 'system' as const, read: false, createdAt: new Date() }
      ];
      mockLocalStorage.setItem('edu_notifications', JSON.stringify(mockNotifications));
      
      // Mock Math.random for predictable ID
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);
      
      const newNotification = addNotification({
        userId: '2',
        message: 'New notification',
        type: 'follow' as const,
        read: false,
        createdAt: new Date()
      });
      
      // Restore original Math.random
      Math.random = originalRandom;
      
      expect(newNotification.userId).toBe('2');
      expect(newNotification.message).toBe('New notification');
      
      const updatedNotifications = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedNotifications.length).toBe(2);
    });
    
    it('marks a notification as read', () => {
      const mockNotifications = [
        { id: '1', userId: '1', message: 'Test notification', type: 'system' as const, read: false, createdAt: new Date() }
      ];
      mockLocalStorage.setItem('edu_notifications', JSON.stringify(mockNotifications));
      
      markNotificationAsRead('1');
      
      const updatedNotifications = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedNotifications[0].read).toBe(true);
    });
    
    it('marks all notifications as read for a user', () => {
      const mockNotifications = [
        { id: '1', userId: '1', message: 'Test notification 1', type: 'system' as const, read: false, createdAt: new Date() },
        { id: '2', userId: '1', message: 'Test notification 2', type: 'follow' as const, read: false, createdAt: new Date() },
        { id: '3', userId: '2', message: 'Test notification 3', type: 'view' as const, read: false, createdAt: new Date() }
      ];
      mockLocalStorage.setItem('edu_notifications', JSON.stringify(mockNotifications));
      
      markAllNotificationsAsRead('1');
      
      const updatedNotifications = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(updatedNotifications[0].read).toBe(true);
      expect(updatedNotifications[1].read).toBe(true);
      expect(updatedNotifications[2].read).toBe(false); // Different user ID
    });
    
    it('gets unread notification count for a user', () => {
      const mockNotifications = [
        { id: '1', userId: '1', message: 'Test notification 1', type: 'system' as const, read: false, createdAt: new Date() },
        { id: '2', userId: '1', message: 'Test notification 2', type: 'follow' as const, read: true, createdAt: new Date() },
        { id: '3', userId: '1', message: 'Test notification 3', type: 'view' as const, read: false, createdAt: new Date() }
      ];
      mockLocalStorage.setItem('edu_notifications', JSON.stringify(mockNotifications));
      
      const count = getUnreadNotificationCount('1');
      expect(count).toBe(2);
    });
  });
});
