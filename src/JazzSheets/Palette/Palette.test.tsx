import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Palette } from './Palette';
import type { Accidental, Duration, NoteName } from '#shared/types';

describe('JazzSheets/Palette/Palette', () => {
  const defaultProps = {
    selectedNote: null as NoteName | null,
    selectedChord: null as NoteName | null,
    selectedDuration: 'quarter' as Duration,
    selectedAccidental: '' as Accidental,
    isRest: false,
    selectedNoteOctave: 4,
    setSelectedNoteOctave: vi.fn(),
    onNoteSelect: vi.fn(),
    onChordSelect: vi.fn(),
    onDurationSelect: vi.fn(),
    onAccidentalToggle: vi.fn(),
    onRestToggle: vi.fn(),
    onClear: vi.fn(),
  };
  it('works', () => {
    render(<Palette {...defaultProps} />);
  });

  it('renders all note buttons', () => {
    render(<Palette {...defaultProps} />);
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    notes.forEach((note) => {
      const buttons = screen.getAllByText(note);
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders all duration buttons', () => {
    render(<Palette {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('1/4')).toBeInTheDocument();
    expect(screen.getByText('1/8')).toBeInTheDocument();
  });

  it('renders all accidental buttons', () => {
    render(<Palette {...defaultProps} />);
    expect(screen.getByText('Natural (♮)')).toBeInTheDocument();
    expect(screen.getByText('♯')).toBeInTheDocument();
    expect(screen.getByText('♭')).toBeInTheDocument();
  });

  it('renders rest and clear buttons', () => {
    render(<Palette {...defaultProps} />);
    const restButtons = screen.getAllByText('Rest');
    expect(restButtons[restButtons.length - 1]).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('displays current octave', () => {
    render(<Palette {...defaultProps} selectedNoteOctave={4} />);
    expect(screen.getByText('Octave: 4')).toBeInTheDocument();
  });

  it('highlights selected note', () => {
    render(<Palette {...defaultProps} selectedNote="C" isRest={false} />);
    const cButtons = screen.getAllByText('C');
    const noteButton = cButtons[0];
    expect(noteButton).toHaveClass('active');
  });

  it('highlights selected chord', () => {
    render(<Palette {...defaultProps} selectedChord="G" isRest={false} />);
    const buttons = screen.getAllByText('G');
    expect(buttons[1]).toHaveClass('active');
  });

  it('highlights selected duration', () => {
    render(<Palette {...defaultProps} selectedDuration="half" />);
    expect(screen.getByText('1/2')).toHaveClass('active');
  });

  it('highlights selected accidental', () => {
    render(<Palette {...defaultProps} selectedAccidental="#" />);
    expect(screen.getByText('♯')).toHaveClass('active');
  });

  it('highlights rest when active', () => {
    render(<Palette {...defaultProps} isRest={true} />);
    const restButtons = screen.getAllByText('Rest');
    expect(restButtons[restButtons.length - 1]).toHaveClass('active');
  });

  it('has +/- buttons for octave control', () => {
    render(<Palette {...defaultProps} />);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });
});
