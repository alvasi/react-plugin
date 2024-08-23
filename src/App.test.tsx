import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './app/App';

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders textarea for user input', () => {
    const textareaElement = screen.getByPlaceholderText(/Describe desired smart contract/i);
    expect(textareaElement).toBeInTheDocument();
  });

  it('toggles tutorial on button click', async () => {
    const toggleButton = screen.getByRole('button', { name: /tutorial/i });
    expect(screen.queryByText(/How to word prompts:/i)).not.toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.getByText(/How to word prompts:/i)).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(screen.queryByText(/How to word prompts:/i)).not.toBeInTheDocument();
  });

  it('allows user to enter text in textarea', async () => {
    const textarea = screen.getByPlaceholderText(/Describe desired smart contract/i);
    await userEvent.type(textarea, 'Hello, world!');
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('clears the input and conversations on clear button click', async () => {
    const input = screen.getByPlaceholderText(/Describe desired smart contract/i);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    const generateButton = screen.getByRole('button', { name: /enter/i });

    // Simulate user typing and submitting
    await userEvent.type(input, 'Test Message');
    await userEvent.click(generateButton);

    // Verify conversation added
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();

    // Clear conversations
    await userEvent.click(clearButton);
    expect(input).toHaveValue('');
    expect(screen.queryByText('You')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });
});