import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './app/App';

describe('App Component', () => {
  it('renders textarea for user input', () => {
    render(<App />);
    const textareaElement = screen.getByPlaceholderText(/Describe desired smart contract/i);
    expect(textareaElement).toBeInTheDocument();
  });
});