
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileView from '../ProfileView';

// Mock the storage utils
vi.mock('@/utils/storage', () => ({
  viewProfile: vi.fn(),
  toggleFollow: vi.fn(() => true),
  isFollowing: vi.fn(() => false),
  deleteProfile: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate
  };
});

const mockProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'This is a test bio',
  imageUrl: '',
  skills: ['JavaScript', 'React'],
  isPrivate: false,
  following: [],
  followers: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  viewCount: 5
};

describe('ProfileView', () => {
  it('renders profile information correctly', () => {
    render(
      <BrowserRouter>
        <ProfileView profile={mockProfile} isOwnProfile={false} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('This is a test bio')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('shows different buttons for own profile vs other profiles', () => {
    // Render own profile
    const { rerender } = render(
      <BrowserRouter>
        <ProfileView profile={mockProfile} isOwnProfile={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Follow')).not.toBeInTheDocument();
    
    // Rerender with isOwnProfile=false
    rerender(
      <BrowserRouter>
        <ProfileView profile={mockProfile} isOwnProfile={false} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('shows analytics section only for own profile', () => {
    // Render own profile
    const { rerender } = render(
      <BrowserRouter>
        <ProfileView profile={mockProfile} isOwnProfile={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Profile Analytics')).toBeInTheDocument();
    
    // Rerender with isOwnProfile=false
    rerender(
      <BrowserRouter>
        <ProfileView profile={mockProfile} isOwnProfile={false} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Profile Analytics')).not.toBeInTheDocument();
  });
});
