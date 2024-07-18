import React, { useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();
client.onload(async () => {
  client.init();
});

export const App = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);

  const handleGenerateTemplate = async () => {
    if (!message.trim()) return;

    const newConversation = {
      user: 'You',
      message: message.trim(),
      bot: 'Loading response...'
    }

    setConversations([...conversations, newConversation]);
    setMessage('');

    const response = await client.message(message);
    console.log(response);

    setConversations(convs => convs.map((conv, index) =>
      index === convs.length - 1 ? { ...conv, bot: response } : conv
    ));
  };

  return (
    // <div className="App">
    //   <iframe src="https://alvasi-test.hf.space" style={{ width: '100%', height: '700px', border: 'none' }}></iframe>
    // </div>
    <div className="container mt-3">
      <div className="conversations mb-2">
        {conversations.map((conv, index) => (
          <React.Fragment key={index}>
            <div>
              <strong>{conv.user}</strong>
            </div>
            <div className="mb-2">
              {conv.message}
            </div>
            <hr style={{ borderColor: '#444' }} />
            <div>
              <strong>Assistant Bot</strong>
            </div>
            <div className="mb-2">
              {conv.bot}
            </div>
            <hr style={{ borderColor: '#444' }} />
          </React.Fragment>
        ))}
      </div>
      <div className="input-group mb-2">
        <textarea
          className="form-control"
          value={message}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerateTemplate() && e.preventDefault()}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe desired smart contract"
          style={{ marginRight: '5px', flex: 'auto' }}
        />
        <button className="btn btn-secondary" onClick={handleGenerateTemplate}>Enter</button>
      </div>
    </div>
  );
};

export default App;