import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import GiphyPicker from '#inertia/components/GiphyPicker';

// Mock axios for API calls
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Sample GIF data for testing
const testGif = {
  id: '123',
  title: 'Test GIF',
  url: 'https://example.com/gif.gif',
  images: {
    original: { url: 'https://example.com/original.gif', width: '500', height: '400' },
    fixed_height: { url: 'https://example.com/fixed_height.gif', width: '300', height: '200' },
    fixed_width: { url: 'https://example.com/fixed_width.gif', width: '300', height: '200' },
    preview_gif: { url: 'https://example.com/preview.gif', width: '150', height: '100' },
  },
};

// Basic props for the component
const defaultProps = {
  isOpen: true,
  searchQuery: 'funny cats',
  onGifSelect: jest.fn(),
  onClose: jest.fn(),
};

describe('GiphyPicker Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test 1: Renders with empty search query
  test('should render correctly with empty search query', () => {
    render(<GiphyPicker {...defaultProps} searchQuery="" />);

    // Should still show the component structure
    expect(screen.getByText('Select a GIF')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search GIFs...')).toBeInTheDocument();

    // Search input should be empty
    const searchInput = screen.getByPlaceholderText('Search GIFs...');
    expect(searchInput).toHaveValue('');
  });

  // Test 2: Renders with different search query values
  test('should render correctly with different search queries', () => {
    const testQueries = ['cats', 'dogs', 'funny memes', '123', '!@#$%'];

    testQueries.forEach(query => {
      const { rerender } = render(<GiphyPicker {...defaultProps} searchQuery={query} />);

      const searchInput = screen.getByPlaceholderText('Search GIFs...');
      expect(searchInput).toHaveValue(query);

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  // Test 3: Handles missing onClose prop gracefully
  test('should handle missing onClose prop gracefully', () => {
    // Remove onClose from props
    const propsWithoutOnClose = {
      isOpen: true,
      searchQuery: 'test',
      onGifSelect: jest.fn(),
      // onClose is missing
    };

    // This should not crash the component
    expect(() => {
      render(<GiphyPicker {...propsWithoutOnClose as any} />);
    }).not.toThrow();

    expect(screen.getByText('Select a GIF')).toBeInTheDocument();
  });

  // Test 4: Handles missing onGifSelect prop gracefully
  test('should handle missing onGifSelect prop gracefully', () => {
    // Remove onGifSelect from props
    const propsWithoutOnGifSelect = {
      isOpen: true,
      searchQuery: 'test',
      onClose: jest.fn(),
      // onGifSelect is missing
    };

    // This should not crash the component
    expect(() => {
      render(<GiphyPicker {...propsWithoutOnGifSelect as any} />);
    }).not.toThrow();

    expect(screen.getByText('Select a GIF')).toBeInTheDocument();
  });

  // Test 5: Renders correctly with long search query
  test('should handle very long search queries', () => {
    const longQuery = 'this is a very long search query that might cause issues with the input field or API calls if not handled properly';

    render(<GiphyPicker {...defaultProps} searchQuery={longQuery} />);

    const searchInput = screen.getByPlaceholderText('Search GIFs...');
    expect(searchInput).toHaveValue(longQuery);
    expect(screen.getByText('Select a GIF')).toBeInTheDocument();
  });

  // Test 6: Renders correctly with special characters in search query
  test('should handle special characters in search query', () => {
    const specialQuery = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    render(<GiphyPicker {...defaultProps} searchQuery={specialQuery} />);

    const searchInput = screen.getByPlaceholderText('Search GIFs...');
    expect(searchInput).toHaveValue(specialQuery);
    expect(screen.getByText('Select a GIF')).toBeInTheDocument();
  });

  // Test 7: Component state persists between renders
  test('should maintain component state when props change', () => {
    const { rerender } = render(<GiphyPicker {...defaultProps} searchQuery="initial" />);

    // Verify initial state
    expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

    // Change search input manually
    const searchInput = screen.getByPlaceholderText('Search GIFs...');
    fireEvent.change(searchInput, { target: { value: 'user typed' } });
    expect(searchInput).toHaveValue('user typed');

    // Re-render with different prop - internal state should be maintained
    rerender(<GiphyPicker {...defaultProps} searchQuery="new prop" />);

    // Should show the new prop value, not the user-typed value
    expect(screen.getByDisplayValue('new prop')).toBeInTheDocument();
  });

  // Test 8: Multiple GIFs display correctly
  test('should display multiple GIFs when available', async () => {
    const multipleGifs = [
      { ...testGif, id: '1', title: 'First GIF' },
      { ...testGif, id: '2', title: 'Second GIF' },
      { ...testGif, id: '3', title: 'Third GIF' },
    ];

    mockAxios.get.mockResolvedValue({
      data: { gifs: multipleGifs }
    });

    render(<GiphyPicker {...defaultProps} />);

    // Wait for all GIFs to appear
    await waitFor(() => {
      expect(screen.getByAltText('First GIF')).toBeInTheDocument();
      expect(screen.getByAltText('Second GIF')).toBeInTheDocument();
      expect(screen.getByAltText('Third GIF')).toBeInTheDocument();
    });
  });

  // Test 9: Component behavior when isOpen changes
  test('should show and hide correctly when isOpen prop changes', () => {
    const { rerender } = render(<GiphyPicker {...defaultProps} isOpen={false} />);

    // Should not be visible initially
    expect(screen.queryByText('Select a GIF')).not.toBeInTheDocument();

    // Show the component
    rerender(<GiphyPicker {...defaultProps} isOpen={true} />);
    expect(screen.getByText('Select a GIF')).toBeInTheDocument();

    // Hide the component again
    rerender(<GiphyPicker {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Select a GIF')).not.toBeInTheDocument();
  });
});
