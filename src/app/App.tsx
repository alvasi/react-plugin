import React, { useState } from 'react';
import { RemixClient } from './deepseek-client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tutorialIcon from '../assets/tutorial_icon.svg';
import './App.css';

// Initialise the RemixClient
const client = new RemixClient();
client.onload(async () => {
  client.init(); // Initialise the client when it loads
});

export const App = () => {
  // State to control visibility of the tutorial panel
  const [showTutorial, setShowTutorial] = useState(false);
  // State to handle the message input from user
  const [message, setMessage] = useState('');
  // State to store all conversations
  const [conversations, setConversations] = useState([]);
  // State to show user consent form for terms and conditions
  const [showPopup, setShowPopup] = useState(false);
  // State to store user agreement to terms and conditions
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAgreeChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  const handleClosePopup = () => {
    if (agreedToTerms) {
      setShowPopup(false);
      localStorage.setItem('firstVisit', 'true');
    } else {
      alert('You must agree to the terms and conditions to use this plugin.');
    }
  };

  // Toggle the visibility of the tutorial section
  const toggleTutorial = () => {
    if (showPopup) {
      return;
    } else {
      setShowTutorial(!showTutorial);
    }
  };

  // Handle generating template based on user's input
  const handleGenerateTemplate = async () => {
    if (!message.trim()) return; // Prevent processing empty messages
    if (!agreedToTerms) {
      alert('You must agree to the terms and conditions to use this plugin.');
      setShowPopup(true);
      return;
    }

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
    client.init(); // Reinitialise the client
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
      {showPopup && (
        <div className="popup">
          <h4>Terms and Conditions</h4>
          <div className="terms-container">
            <p>
              Please read and agree to the terms and conditions below to use
              this plugin:
            </p>
            <div className="terms-text">
              <p>
                The AI chat assistant is an external API service. This
                third-party service may collect your text input. Please refrain
                from including any sensitive data.
              </p>
              <p>
                The DeepSeek API service automatically collects information from
                you when you use the plugin, including internet or other network
                activity information such as your IP address, unique device
                identifiers, and cookies.{' '}
              </p>
              <p>
                <strong>Log Data.</strong>Information that your browser or
                device automatically sends when you use the plugin. Log data
                includes your Internet Protocol address, browser type and
                settings, the date and time of your request, and how you
                interact with the external API.{' '}
              </p>
              <p>
                <strong>Usage Information.</strong>Deepseek collects information
                regarding your use of their services, such as the features you
                use and the actions you take.
              </p>
              <p>
                <strong>Device Information.</strong>Deepseek collect certain
                information about the device you use to access their services,
                such as your unique device identifiers (device ID), network type
                and connections, mobile or device model, device manufacturer,
                application version number, operating system, device resolution,
                and system language and region.{' '}
              </p>
              <p>
                <strong>Cookies.</strong>Deepseek and their service providers
                and business partners may use cookies and other similar
                technologies (e.g., web beacons, flash cookies, etc.)
                (“Cookies”) to automatically collect information, measure and
                analyse how their services are used. Cookies enable certain
                features and functionality. Web beacons are very small images or
                small pieces of data embedded in images, also known as “pixel
                tags” or “clear GIFs,” that can recognise Cookies, the time and
                date a page is viewed, a description of the page where the pixel
                tag is placed, and similar information from your computer or
                device.{' '}
              </p>

              <p>
                Deepseek uses your information to promote the safety and
                security of their, including by scanning, analysing, and
                reviewing content, messages and associated metadata for
                violations of our Terms of Service or other conditions and
                policies.
              </p>
              <p>
                They also use it to operate, provide, develop, and improve their
                services, including for the following purposes.{' '}
              </p>

              <p>
                Provide you with user support, notify you about changes to the
                services and communicate with you;
              </p>
              <p>Detect abuse, fraud and illegal activity on the services;</p>
              <p>
                Promote the safety and security of the services; Enforce their
                Terms, Guidelines, and other policies that apply to you and to
                protect the safety and well-being of our community;
              </p>
              <p>
                Carry out data analysis, research and investigations, and test
                the services to ensure its stability and security;
              </p>
              <p>
                Comply with any applicable laws, regulations, codes of practice,
                guidelines, or rules, or to assist in law enforcement and
                investigations conducted by any governmental and/or regulatory
                authority;
              </p>
              <p>Understand how you use the services;</p>
              <p>Administer the services, including troubleshooting;</p>
              <p>
                Promote the service or third party services through marketing
                communications, contests, or promotions;
              </p>
              <p>
                For any other purposes for which you have provided the
                information, with your consent or at your direction.
              </p>
            </div>
          </div>
          <div className="terms-agreement">
            <label>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleAgreeChange}
              />
              I agree to the terms and conditions.
            </label>
          </div>
          <button className= "btn btn-secondary" onClick={handleClosePopup} disabled={!agreedToTerms}>
            Agree and Continue
          </button>
        </div>
      )}
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
          <p>
            <small>
              <strong>Disclaimer:</strong> The AI Assistant is powered by
              Deepseek API, which utilises AI/ML and therefore may produce
              inaccurate information. You should always review any information
              produced by the assistant to ensure that any results are accurate
              and suit your purposes.
            </small>
          </p>
          <p>
            <strong>How to word prompts:</strong>
          </p>
          <ul>
            <li>
              Specify the context and include important details such as
              standards and protocols you want the generated contract to
              implement.
            </li>
            <li>
              Add error message and remediation suggestions provided by compiler
              and code analysers (Remix, Solhint, SolidityScan)
            </li>
            <li>
              Split a complex task into a set of smaller, more manageable
              instructions
            </li>
            <li>
              Explicitly point out any missed implementation from previous
              prompts.
            </li>
          </ul>
          <p>
            For more detailed examples, refer to{' '}
            <a
              href="https://platform.openai.com/docs/guides/prompt-engineering"
              target="_blank"
              rel="noopener noreferrer"
            >
              Prompt Engineering Guide
            </a>
            .{' '}
          </p>
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
