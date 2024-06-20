import React, { useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  return (
    <div>
      <p>Smart Contract Vulnerability Checker</p>
      <button onClick={async () => {
        const prompt = await client.getCurrentFileContent();
        const code = await client.generateCode(prompt);
        console.log(code);
      }}>Check Vulnerabilities</button>
    </div>
  );
};

export default App;

