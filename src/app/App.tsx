import React, { useState, useCallback } from 'react';
import { RemixClient } from './deepseek-client';
// import { RemixClient } from './claude-client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tutorialIcon from '../assets/tutorial_icon.svg'
import './App.css';

const client = new RemixClient();
client.onload(async () => {
  client.init();
});

export const App = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);

  const toggleTutorial = () => setShowTutorial(!showTutorial);

  const handleGenerateTemplate = async () => {
    if (!message.trim()) return;

    const newConversation = {
      user: 'You',
      message: message.trim(),
      bot: ''
    }

    setConversations([...conversations, newConversation]);
    setMessage('');

    await client.message(message, (streamedResponse) => {
      setConversations(convs => convs.map((conv, index) =>
        index === convs.length - 1 ? { ...conv, bot: conv.bot + streamedResponse } : conv
      ));
    });

    // // non-streaming response
    // const response = await client.message(message);
    // setConversations(convs => convs.map((conv, index) =>
    //   index === convs.length - 1 ? { ...conv, bot: response } : conv
    // ));
  };

  const handleClear = () => {
    client.init();
    setConversations([]);
    setMessage('');
  };

  const handleCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.style.position = 'fixed';// Avoid scrolling to bottom
    textArea.style.left = '-9999px';// Move element out of screen horizontally
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Copied!' : 'Press Ctrl+C to copy';
      console.log(msg);
      alert(msg);
    } catch (err) {
      console.error('Failed to copy with manual fallback:', err);
      alert('Press Ctrl+C to copy');
    }
    document.body.removeChild(textArea);
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <div style={{ position: 'relative' }}>
          <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props} className="p-3">
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button onClick={() => handleCopyText(String(children).replace(/\n$/, ''))} style={{ position: "absolute", right: "10px", top: "5px" }}>
            Copy
          </button>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="container mt-3">
      <div className="tutorial">
        <button className="btn btn-secondary tutorial-btn" onClick={toggleTutorial}><img src={tutorialIcon} alt="Tutorial" /></button>
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
              <div className="conversation-log mb-2">
                {conv.message}
              </div>
            </div>
            <hr style={{ borderColor: '#444' }} />
            <div className="bot-response">
              <div>
                <strong>Assistant Bot</strong>
              </div>
              <div className="conversation-log mb-2">
                <ReactMarkdown components={components}>{conv.bot}</ReactMarkdown>
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
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerateTemplate() && e.preventDefault()}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe desired smart contract"
          style={{ marginRight: '5px', flex: 'auto' }}
        />
        <button className="btn btn-secondary" onClick={handleGenerateTemplate}>Enter</button>
        <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
};

export default App;