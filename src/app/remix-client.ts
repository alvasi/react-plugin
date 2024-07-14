// remix-client.ts
import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';

export class RemixClient extends PluginClient {
  constructor() {
    super();
    this.methods = ['createTemplate'];
    createClient(this);
  }

  async createTemplate(message = "Hello!") {
    try {
      const response = await fetch('http://localhost:8000/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Generated Text:', data.generatedText);
      return data.generatedText;
    } catch (error) {
      console.error('Error generating template: ', error);
      throw new Error('Failed to generate template');
    }
  }
}

export default new RemixClient();