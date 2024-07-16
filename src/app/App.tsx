import React, { useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);

  const handleGenerateTemplate = async () => {
    const newUserMessage = { user: 'You', message: message, bot: '' };
    const loadingMessage = { user: 'Bot', message: 'Loading response...', bot: '' };

    setConversations([...conversations, newUserMessage, loadingMessage]);
    setMessage('');

    const fullResponse = await client.createTemplate(message);
    console.log(fullResponse);
    // const assistantResponse = fullResponse.split('<|assistant|>').pop().split('</s>')[0].trim();

    // const updatedConversations = conversations.concat(newUserMessage, { user: 'Bot', message: assistantResponse, bot: '' });
    // setConversations(updatedConversations);
  };

  return (
    // <div className="container mt-5">
    //   <div className="conversations mb-3" style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', color: 'white' }}>
    //     {conversations.map((conv, index) => (
    //       <div key={index} className="mb-3">
    //         <div className="mb-2" style={{ fontFamily: 'monospace' }}><strong>{conv.user}:</strong> {conv.message}</div>
    //         {conv.bot && <div style={{ fontFamily: 'monospace' }}><strong>Bot:</strong> {conv.bot}</div>}
    //       </div>
    //     ))}
    //   </div>
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe desired smart contract"
        style={{ marginRight: '5px', flex: 'auto' }}
      />
      <button className="btn btn-secondary" onClick={handleGenerateTemplate}>Enter</button>
    </div>
    // </div>
  );
};

export default App;