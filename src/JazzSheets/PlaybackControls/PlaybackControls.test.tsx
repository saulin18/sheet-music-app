import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaybackControls } from './PlaybackControls';

describe('JazzSheets/PlaybackControls/PlaybackControls', () => {
  const defaultProps = {
    isPlaying: false,
    tempo: 120,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onStop: vi.fn(),
    onTempoChange: vi.fn(),
  };
  it('works', () => {
    render(<PlaybackControls {...defaultProps} />);
  });

  it('renders play button when not playing', () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByText('▶ Play')).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    render(<PlaybackControls {...defaultProps} isPlaying={true} />);
    expect(screen.getByText('⏸ Pause')).toBeInTheDocument();
  });

  it('renders stop button', () => {
    render(<PlaybackControls {...defaultProps} />);
    expect(screen.getByText('⏹ Stop')).toBeInTheDocument();
  });

  it('displays current tempo', () => {
    render(<PlaybackControls {...defaultProps} tempo={100} />);
    expect(screen.getByText('Tempo: 100 BPM')).toBeInTheDocument();
  });

  it('has tempo slider', () => {
    render(<PlaybackControls {...defaultProps} />);
    const slider = screen.getByLabelText(/tempo/i);
    expect(slider).toHaveValue('120');
  });

  it('calls onPlay when play button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls {...defaultProps} />);

    await user.click(screen.getByText('▶ Play'));

    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls {...defaultProps} isPlaying={true} />);

    await user.click(screen.getByText('⏸ Pause'));

    expect(defaultProps.onPause).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls {...defaultProps} />);

    await user.click(screen.getByText('⏹ Stop'));

    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('calls onTempoChange when slider is changed', () => {
    render(<PlaybackControls {...defaultProps} />);

    const slider = screen.getByLabelText(/tempo/i);
    fireEvent.change(slider, { target: { value: '150' } });

    expect(defaultProps.onTempoChange).toHaveBeenCalled();
  });
});
