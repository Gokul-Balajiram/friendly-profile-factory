
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchUsers from '../SearchUsers';

// Mock the storage utils
vi.mock('@/utils/storage', () => ({
  getProfiles: vi.fn(() => [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      skills: ['Math', 'Science'],
      imageUrl: '',
      bio: 'Test bio',
      isPrivate: false,
      following: [],
      followers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      skills: ['Art', 'Music'],
      imageUrl: '',
      bio: 'Test bio',
      isPrivate: false,
      following: [],
      followers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0
    }
  ])
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

describe('SearchUsers', () => {
  it('renders the search input', () => {
    render(
      <BrowserRouter>
        <SearchUsers />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/search by name, email or skills/i)).toBeInTheDocument();
  });

  it('filters users based on search term', async () => {
    render(
      <BrowserRouter>
        <SearchUsers />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search by name, email or skills/i);
    
    // Search for John
    fireEvent.change(searchInput, { target: { value: 'john' } });
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    
    // Search for Art skill
    fireEvent.change(searchInput, { target: { value: 'art' } });
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('shows no results message when no users match', async () => {
    render(
      <BrowserRouter>
        <SearchUsers />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search by name, email or skills/i);
    
    // Search for a non-existent user
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });

  it('navigates to user profile when View button is clicked', async () => {
    render(
      <BrowserRouter>
        <SearchUsers />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search by name, email or skills/i);
    
    // Search for John
    fireEvent.change(searchInput, { target: { value: 'john' } });
    
    // Click the View button
    const viewButton = await screen.findByText('View');
    fireEvent.click(viewButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/view-profile/1');
  });
});
