
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/ui/SearchBar';
import '@testing-library/jest-dom'; // Ensure matchers are available

describe('SearchBar', () => {
  it('should render input with correct placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText('Filter subscriptions...');
    expect(input).toBeInTheDocument();
  });

  it('should have a valid aria-label', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    const input = screen.getByLabelText('Filter subscriptions');
    expect(input).toBeInTheDocument();
  });

  it('should display the current value', () => {
    render(<SearchBar value="Netflix" onChange={() => {}} />);
    const input = screen.getByDisplayValue('Netflix');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when input changes', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Filter subscriptions...');
    fireEvent.change(input, { target: { value: 'Spotify' } });
    
    expect(handleChange).toHaveBeenCalledWith('Spotify');
  });
});
