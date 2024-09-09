import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './app/App';

// Use vi to mock RemixClient
vi.mock('./app/deepseek-client', () => {
  return {
    RemixClient: vi.fn().mockImplementation(() => {
      return {
        init: vi.fn(),
        onload: vi.fn().mockImplementation((callback) => {
          callback();
        }),
        message: (message, onStreamUpdate) => {
          // Check the message to decide which mock response to send
          if (message === 'fetchContractCode') {
            const solidityCode = '```solidity\n// Mock Solidity code\n```';
            onStreamUpdate(solidityCode);
          } else {
            // Default mock response for other messages
            const mockResponse = 'Mock response for ' + message;
            onStreamUpdate(mockResponse);
          }
        },
      };
    }),
  };
});

// Utility function to give user consent
const giveUserConsent = async () => {
  const agreeCheckbox = screen.getByRole('checkbox', {
    name: /I agree to the terms and conditions./i,
  });
  const agreeButton = screen.getByRole('button', {
    name: /Agree and Continue/i,
  });
  await userEvent.click(agreeCheckbox);
  await userEvent.click(agreeButton);
};

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders textarea for user input', () => {
    const textareaElement = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
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
    const textarea = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    await userEvent.type(textarea, 'Hello, world!');
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('creates a new line in textarea on Shift+Enter', async () => {
    const textareaElement = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    textareaElement.focus(); // Focus the textarea before typing
    expect(textareaElement.value).not.toMatch(/\n/); // Verify that the textarea value does not contain a newline
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}'); // Simulate typing Shift+Enter in the textarea
    expect(textareaElement.value).toMatch(/\n$/);
  });

  it('requires user consent before receiving a response for the first time', async () => {
    const input = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    const generateButton = screen.getByRole('button', { name: /enter/i });
    await userEvent.type(input, 'Test Message');
    await userEvent.click(generateButton);

    // Check if the consent popup is shown
    const termsHeading = screen.getByRole('heading', {
      name: /Terms and Conditions/i,
    });
    expect(termsHeading).toBeInTheDocument();
  });

  it('generates a bot response on enter button click', async () => {
    const input = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    const generateButton = screen.getByRole('button', { name: /enter/i });

    // Simulate user typing and submitting
    await userEvent.type(input, 'Test Message');
    await userEvent.click(generateButton);
    giveUserConsent();
    await userEvent.click(generateButton);

    // Verify conversation added
    expect(screen.getByText('Assistant Bot')).toBeInTheDocument();
    expect(
      screen.getByText(/Mock response for Test Message/i),
    ).toBeInTheDocument();
  });

  it('clears the input and conversations on clear button click', async () => {
    const input = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    const clearButton = screen.getByRole('button', { name: /clear/i });
    const generateButton = screen.getByRole('button', { name: /enter/i });

    // Simulate user typing and submitting
    await userEvent.type(input, 'Test Message');
    await userEvent.click(generateButton);
    giveUserConsent();
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

  it('shows copy button when code chunk is present', async () => {
    const input = screen.getByPlaceholderText(
      /Describe desired smart contract/i,
    );
    const generateButton = screen.getByRole('button', { name: /enter/i });
    const fetchContractCode = 'fetchContractCode';

    // Check that the copy button is not present before clicking the generate button
    expect(
      screen.queryByRole('button', { name: /copy/i }),
    ).not.toBeInTheDocument();

    // Simulate user typing markdown with a code block and submitting
    await userEvent.type(input, fetchContractCode);
    await userEvent.click(generateButton);
    giveUserConsent();
    await userEvent.click(generateButton);

    // Check if the copy button is present in the document after clicking the generate button
    await expect(
      screen.findByRole('button', { name: /copy/i }),
    ).resolves.toBeInTheDocument();
  });
});
