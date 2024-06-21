import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  return (
    <div>
      <p>Smart Contract Vulnerability Checker</p>
      <button onClick={async () => {
        const prompt = await client.checkVulnerabilities();
        console.log(prompt);
      }}>Check Vulnerabilities</button>
    </div>
  );
};

export default App;

