import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import { Client } from '@gradio/client';

export class RemixClient extends PluginClient {
  gradioClient: Client;

  constructor() {
    super();
    this.methods = ['init','message'];
    createClient(this);
  }

  async init() {
    this.gradioClient = await Client.connect("alvasi/test");
  }

  async message(message = "I want a smart contract for purchasing NFTs") {
    try {
      const result = await this.gradioClient.predict("/chat", {
        message: message,
        system_message: "You are a useful assistant that recommends a solidity smart contract template based on the user's prompt",
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
      });
      if (result.data) {
        console.log("Response data found");
        return result.data;
      } else {
        console.log("No response data found.");
      }
    } catch (error) {
      console.error('Error generating template: ', error);
      throw new Error('Failed to generate template');
    }
  }
}

// export default new RemixClient();
