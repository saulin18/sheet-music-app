import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Staff } from './Staff';

describe('JazzSheets/Staff/Staff', () => {
  const defaultProps = {
    music: [],
    currentPosition: 0,
    isPlaying: false,
    onNoteClick: vi.fn(),
    onDelete: vi.fn(),
    onMaximumWidthChange: vi.fn(),
  };
  it('works', () => {
    render(<Staff {...defaultProps} />);
  });
});
