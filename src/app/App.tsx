import React, { useEffect, useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  return (
    <div>
      <h1>React Plugin Test</h1>
      <p>Dynamic Theme formatting</p>
    </div>
  );
};

export default App;
