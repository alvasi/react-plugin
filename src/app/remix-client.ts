import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import { Client } from '@gradio/client';

export class RemixClient extends PluginClient {
  constructor() {
    super();
    this.methods = ['createTemplate'];
    createClient(this);
  }

  async createTemplate(message = "I want a smart contract for purchasing NFTs") {
    try {
      // const client = await Client.connect("alvasi/test");
      // const result = await client.predict("/chat", {
      //   message: message,
      //   system_message: "You are a useful assistant that recommends a solidity smart contract template based on the user's prompt",
      //   max_tokens: 1,
      //   temperature: 0.1,
      //   top_p: 0.1,
      // });
      // if (result.data) {
      //   console.log("Response found.");
      //   return result.data;
      // } else {
      //   console.log("No response data found.");
      // }
      // console.log(result.data);
      // return result.data;
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