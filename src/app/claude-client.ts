import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import Anthropic from '@anthropic-ai/sdk';

export class RemixClient extends PluginClient {
  claudeClient: Anthropic;
  messages = [];

  constructor() {
    super();
    this.methods = ['init', 'message'];
    createClient(this);
  }

  async init() {
    this.claudeClient = new Anthropic({
      apiKey: process.env.REACT_APP_ANTHROPIC_API,
    });
  }

  async message(message = 'I want a smart contract for purchasing NFTs') {
    try {
      this.messages.push({ role: 'user', content: message });
      const params: Anthropic.MessageCreateParams = {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2048,
        messages: this.messages,
        system:
          "You are a useful coder that codes secure solidity smart contracts based on user's prompt. Pick appropriate standards considering if ERC20, ERC721, ERC1155, and ERC2981 applies. Avoid vulnerabilities such as reentrancy with check-effects-interaction, avoid low level calls, be careful of gas costs (e.g., avoid for loops over dynamic arrays) and try to use more different variable names. Implement as much as possible. Ask user if further clarification for functionality is needed",
      };
    } catch (error) {
      console.error('Error in anthropic message method: ', error);
      throw error;
    }
  }
}
