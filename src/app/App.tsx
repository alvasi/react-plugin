// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  return (
    <div>
      <h1>React Plugin Test</h1>
      <p>Dynamic Theme formatting</p>
      <p>Testing 123</p>
    </div>
  );
};

export default App;
