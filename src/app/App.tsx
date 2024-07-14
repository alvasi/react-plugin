import { useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  const [message, setMessage] = useState('');

  return (
    <div>
      <p>Smart Contract Template Generator</p>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe desired smart contract"
      />
      <button onClick={async () => {
        const prompt = await client.createTemplate(message);
        console.log(prompt);
      }}>Enter</button>
    </div>
  );
};

export default App;

