import { RemixClient } from './remix-client';
import './App.css';

const client = new RemixClient();

export const App = () => {
  return (
    <div>
      <p>Smart Contract Template Generator</p>
      <button onClick={async () => {
        const prompt = await client.createTemplate();
        console.log(prompt);
      }}>Create Template</button>
    </div>
  );
};

export default App;

