import React, { useState } from 'react';
import { RemixClient } from './deepseek-client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tutorialIcon from '../assets/tutorial_icon.svg';
import './App.css';

// Initialize the RemixClient
const client = new RemixClient();
client.onload(async () => {
  client.init(); // Initialize the client when it loads
});

export const App = () => {
  // State to control visibility of the tutorial panel
  const [showTutorial, setShowTutorial] = useState(false);
  // State to handle the message input from user
  const [message, setMessage] = useState('');
  // State to store all conversations
  const [conversations, setConversations] = useState([]);

  // Toggle the visibility of the tutorial section
  const toggleTutorial = () => setShowTutorial(!showTutorial);

  // Handle generating template based on user's input
  const handleGenerateTemplate = async () => {
    if (!message.trim()) return; // Prevent processing empty messages

    // Create a new conversation entry
    const newConversation = {
      user: 'You',
      message: message.trim(),
      bot: '',
    };

    // Add the new conversation to the state and reset message input
    setConversations([...conversations, newConversation]);
    setMessage('');

    // Call client message function with current message and handle streamed responses
    await client.message(message, (streamedResponse) => {
      setConversations((convs) =>
        convs.map((conv, index) =>
          index === convs.length - 1
            ? { ...conv, bot: conv.bot + streamedResponse }
            : conv,
        ),
      );
    });
  };

  // Clears all conversations and resets the message input
  const handleClear = () => {
    client.init(); // Reinitialize the client
    setConversations([]); // Clear conversations
    setMessage(''); // Clear the message input
  };

  // Handle the enter key press to trigger template generation
  const onKeyDownHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleGenerateTemplate();
      e.preventDefault(); // Prevent default to stop form submission
    }
  };

  // Function to handle text copying to clipboard
  const handleCopyText = (text) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text; // Set its value to the text to be copied
    document.body.appendChild(textArea); // Append it to the body to make it part of the document
    textArea.style.position = 'fixed'; // Set position to fixed to keep it out of view
    textArea.style.left = '-9999px'; // Move it off-screen to avoid disrupting layout

    textArea.focus(); // Focus on the textarea
    textArea.select(); // Select all text inside the textarea

    // Try to copy the text using the execCommand and handle potential failure
    try {
      const successful = document.execCommand('copy'); // Attempt to copy text
      const msg = successful ? 'Copied!' : 'Press Ctrl+C to copy'; // Set message based on success
      console.log(msg); // Log the result for debugging
      alert(msg); // Show the user the result via alert
    } catch (err) {
      console.error('Failed to copy with manual fallback:', err); // Log any errors
      alert('Press Ctrl+C to copy'); // Inform user how to copy manually on error
    }

    // Clean up by removing the textarea from the document
    document.body.removeChild(textArea);
  };

  // Component for handling code block rendering in Markdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      // Extract the language from className, defaulting to plain text if none found
      const match = /language-(\w+)/.exec(className || '');
      // Check if there is a language class; if so, render with SyntaxHighlighter
      return !inline && match ? (
        <div style={{ position: 'relative' }}>
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
            className="p-3"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => handleCopyText(String(children).replace(/\n$/, ''))}
            style={{ position: 'absolute', right: '10px', top: '5px' }}
          >
            Copy
          </button>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="container mt-3">
      <div className="tutorial">
        <button
          className="btn btn-secondary tutorial-btn"
          onClick={toggleTutorial}
        >
          <img src={tutorialIcon} alt="Tutorial" />
        </button>
      </div>
      {showTutorial && (
        <div className="tutorial-content">
          <p>How to word prompts:</p>
          <ul>
            <li>Be clear and concise.</li>
            <li>Specify the context if necessary.</li>
            <li>Use simple language.</li>
          </ul>
        </div>
      )}
      <div className="conversations mb-2">
        {conversations.map((conv, index) => (
          <React.Fragment key={index}>
            <div className="user-input">
              <div>
                <strong>{conv.user}</strong>
              </div>
              <div className="conversation-log mb-2">{conv.message}</div>
            </div>
            <hr style={{ borderColor: '#444' }} />
            <div className="bot-response">
              <div>
                <strong>Assistant Bot</strong>
              </div>
              <div className="conversation-log mb-2">
                <ReactMarkdown components={components}>
                  {conv.bot}
                </ReactMarkdown>
              </div>
            </div>
            <hr style={{ borderColor: '#444' }} />
          </React.Fragment>
        ))}
      </div>
      <div className="input-group mb-2">
        <textarea
          className="form-control"
          value={message}
          onKeyDown={onKeyDownHandler}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe desired smart contract"
          style={{ marginRight: '5px', flex: 'auto' }}
        />
        <button className="btn btn-secondary" onClick={handleGenerateTemplate}>
          Enter
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default App;
