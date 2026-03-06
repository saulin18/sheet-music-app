import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongList } from './SongList';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('JazzSheets/SongList/SongList', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  const defaultProps = {
    currentNotes: [],
    currentTempo: 120,
    onLoadSong: vi.fn(),
  };

  it('works', () => {
    render(<SongList {...defaultProps} />);
  });

  it('renders song name input', () => {
    render(<SongList {...defaultProps} />);
    expect(screen.getByPlaceholderText('Song name')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<SongList {...defaultProps} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows empty state when no songs', () => {
    render(<SongList {...defaultProps} />);
    expect(screen.getByText('No saved songs')).toBeInTheDocument();
  });

  it('allows typing song name', async () => {
    const user = userEvent.setup();
    render(<SongList {...defaultProps} />);

    const input = screen.getByPlaceholderText('Song name');
    await user.type(input, 'My Song');

    expect(input).toHaveValue('My Song');
  });

  it('calls onLoadSong when load button is clicked', async () => {
    const user = userEvent.setup();
    const testSong = {
      id: '1',
      name: 'Test Song',
      notesAndChords: [],
      tempo: 120,
    };

    localStorageMock.setItem('sheet-music-songs', JSON.stringify([testSong]));

    render(<SongList {...defaultProps} />);

    await user.click(screen.getByText('Load'));

    expect(defaultProps.onLoadSong).toHaveBeenCalledWith(testSong);
  });
});
