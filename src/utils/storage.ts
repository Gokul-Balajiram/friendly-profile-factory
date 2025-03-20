
// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  imageUrl: string;
  skills: string[];
  isPrivate: boolean;
  following: string[];
  followers: string[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'follow' | 'view' | 'system';
  read: boolean;
  createdAt: Date;
}

// Mock storage using localStorage
const PROFILES_KEY = 'edu_profiles';
const CURRENT_USER_KEY = 'edu_current_user';
const NOTIFICATIONS_KEY = 'edu_notifications';

// Get all profiles
export const getProfiles = (): UserProfile[] => {
  const profilesJson = localStorage.getItem(PROFILES_KEY);
  return profilesJson ? JSON.parse(profilesJson) : [];
};

// Save profiles
const saveProfiles = (profiles: UserProfile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

// Get current user
export const getCurrentUser = (): UserProfile | null => {
  const userIdJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userIdJson) return null;
  
  const userId = JSON.parse(userIdJson);
  const profiles = getProfiles();
  return profiles.find(profile => profile.id === userId) || null;
};

// Save current user ID
export const setCurrentUser = (userId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userId));
};

// Create a new profile
export const createProfile = (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'followers'>): UserProfile => {
  const profiles = getProfiles();
  
  // Check if email already exists
  if (profiles.some(p => p.email === profile.email)) {
    throw new Error('Email already exists');
  }
  
  const newProfile: UserProfile = {
    ...profile,
    id: Math.random().toString(36).substring(2, 15),
    followers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0
  };
  
  profiles.push(newProfile);
  saveProfiles(profiles);
  setCurrentUser(newProfile.id);
  
  return newProfile;
};

// Update profile
export const updateProfile = (profile: Partial<UserProfile> & { id: string }): UserProfile => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  
  if (index === -1) {
    throw new Error('Profile not found');
  }
  
  if (profile.email && profile.email !== profiles[index].email) {
    // Check if new email already exists
    if (profiles.some(p => p.email === profile.email && p.id !== profile.id)) {
      throw new Error('Email already exists');
    }
  }
  
  const updatedProfile = {
    ...profiles[index],
    ...profile,
    updatedAt: new Date()
  };
  
  profiles[index] = updatedProfile;
  saveProfiles(profiles);
  
  return updatedProfile;
};

// Delete profile
export const deleteProfile = (id: string): void => {
  let profiles = getProfiles();
  profiles = profiles.filter(p => p.id !== id);
  saveProfiles(profiles);
  
  if (getCurrentUser()?.id === id) {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Get profile by ID
export const getProfileById = (id: string): UserProfile | null => {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id) || null;
};

// View profile (increment view count)
export const viewProfile = (id: string): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  
  if (index !== -1) {
    profiles[index].viewCount += 1;
    saveProfiles(profiles);
    
    // Create notification for profile view
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id !== id) {
      addNotification({
        userId: id,
        message: `${currentUser.name} viewed your profile`,
        type: 'view',
        read: false,
        createdAt: new Date()
      });
    }
  }
};

// Follow/unfollow user
export const toggleFollow = (targetUserId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not logged in');
  
  const profiles = getProfiles();
  const currentUserIndex = profiles.findIndex(p => p.id === currentUser.id);
  const targetUserIndex = profiles.findIndex(p => p.id === targetUserId);
  
  if (currentUserIndex === -1 || targetUserIndex === -1) {
    throw new Error('User not found');
  }
  
  const isFollowing = profiles[currentUserIndex].following.includes(targetUserId);
  
  if (isFollowing) {
    // Unfollow
    profiles[currentUserIndex].following = profiles[currentUserIndex].following.filter(id => id !== targetUserId);
    profiles[targetUserIndex].followers = profiles[targetUserIndex].followers.filter(id => id !== currentUser.id);
  } else {
    // Follow
    profiles[currentUserIndex].following.push(targetUserId);
    profiles[targetUserIndex].followers.push(currentUser.id);
    
    // Create notification
    addNotification({
      userId: targetUserId,
      message: `${currentUser.name} started following you`,
      type: 'follow',
      read: false,
      createdAt: new Date()
    });
  }
  
  saveProfiles(profiles);
  return !isFollowing; // Return new following state
};

// Get following status
export const isFollowing = (targetUserId: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  return currentUser.following.includes(targetUserId);
};

// Get notifications
export const getNotifications = (userId: string): Notification[] => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
  const allNotifications: Notification[] = notificationsJson ? JSON.parse(notificationsJson) : [];
  return allNotifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Add notification
export const addNotification = (notification: Omit<Notification, 'id'>): Notification => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
  const notifications: Notification[] = notificationsJson ? JSON.parse(notificationsJson) : [];
  
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substring(2, 15)
  };
  
  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  return newNotification;
};

// Mark notification as read
export const markNotificationAsRead = (id: string): void => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsJson) return;
  
  const notifications: Notification[] = JSON.parse(notificationsJson);
  const index = notifications.findIndex(n => n.id === id);
  
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = (userId: string): void => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsJson) return;
  
  const notifications: Notification[] = JSON.parse(notificationsJson);
  const updatedNotifications = notifications.map(n => 
    n.userId === userId ? { ...n, read: true } : n
  );
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

// Get unread notification count
export const getUnreadNotificationCount = (userId: string): number => {
  const notifications = getNotifications(userId);
  return notifications.filter(n => !n.read).length;
};
