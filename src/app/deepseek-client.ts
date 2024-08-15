import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import OpenAI from 'openai';

export class RemixClient extends PluginClient {
  deepseekClient: OpenAI;
  messages = [];

  constructor() {
    super();
    this.methods = ['init', 'message'];
    createClient(this);
  }

  async init() {
    this.deepseekClient = new OpenAI({
      apiKey: "sk-7885a3110d2646f0bfb7e8a5732045fe", //process.env.DEEPSEEK_API,
      baseURL: "https://api.deepseek.com",
      dangerouslyAllowBrowser: true
    })
    this.messages.push({ content: "You are a useful coder that codes secure solidity smart contracts based on user's prompt. Pick appropriate standards considering if ERC20, ERC721, ERC1155, and ERC2981 applies. Avoid vulnerabilities such as reentrancy with check-effects-interaction, avoid low level calls, be careful of gas costs (e.g., avoid for loops over dynamic arrays) and try to use more different variable names. Implement as much as possible. Ask user if further clarification for functionality is needed", role: "system" })
  }

  async message(message = "I want a smart contract for purchasing NFTs") {
    try {
      this.messages.push({ content: message, role: "user" });
      const params: OpenAI.ChatCompletionCreateParams = {
        model: "deepseek-coder",
        messages: this.messages,
        max_tokens: 2048,
        temperature: 1,
        top_p: 1,
        stream: false,
      }
      const chatCompletion: OpenAI.Chat.ChatCompletion = await this.deepseekClient.chat.completions.create(params);
      this.messages.push({ content: chatCompletion.choices[0].message.content, role: "assistant" });
      return chatCompletion.choices[0].message.content;
    } catch (error){
      console.error("Error in message method: ", error);
      throw error;
    }
  }
}