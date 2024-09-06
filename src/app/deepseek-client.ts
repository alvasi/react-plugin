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
      apiKey: process.env.REACT_APP_DEEPSEEK_API,
      baseURL: 'https://api.deepseek.com',
      dangerouslyAllowBrowser: true,
    });
    this.messages.push({
      content: `You are a useful coder that codes secure solidity smart contracts based on user's prompt. 
      Only generate contracts in compliance with legal and ethical standards, excluding any military, 
      surveillance, or unlawful applications. Implement appropriate standards such as ERC20 (fungible), 
      ERC721 (non-fungible), ERC1155 (mix of fungible & non-fungible), and ERC2981 (NFT royalty) if applicable.
      Use strictly Solidity Pragma version (0.8.27). Ensure minting functions includes proper access control mechanisms.
      Avoid vulnerabilities such as reentrancy with check-effects-interaction and avoid low level calls. 
      Validate arguments with require or assert statements. Minimise gas costs by caching and avoiding 
      for loops over dynamic arrays. Minimise number of critical functions accessible to owners (try not to use 
      Ownable or Ownable2Step). Use Roles.sol if role-based access control is required. 
      Use _grantRole instead of _setupRole. Implement as much as possible but be concise. 
      Ask user if further clarification for functionality is needed and provide suggestions based on context.`,
      role: 'system',
    });
  }

  // streaming response, user sees content as it is being generated
  async message(
    message = 'I want a smart contract for purchasing NFTs',
    onStreamUpdate,
  ) {
    try {
      this.messages.push({ content: message, role: 'user' });
      if (!this.deepseekClient || !this.deepseekClient.beta) {
        console.error(
          'DeepseekClient or deepseekClient.beta is not initialised',
        );
        return;
      }
      console.time('Stream Response Time'); // start timer
      const stream = await this.deepseekClient.beta.chat.completions.stream({
        model: 'deepseek-coder',
        messages: this.messages,
        max_tokens: 2048,
        temperature: 1,
        top_p: 1,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        onStreamUpdate(content);

        if (chunk.usage) {
          // log usage information
          console.log('Usage: ', chunk.usage);
        }
      }

      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await stream.finalChatCompletion();
      console.log(chatCompletion.choices[0].message.content);
      console.timeEnd('Stream Response Time'); // end timer
      this.messages.push({
        content: chatCompletion.choices[0].message.content,
        role: 'assistant',
      });
    } catch (error) {
      console.error('Error in message methodL ', error);
      throw error;
    }
  }

  // // non-streaming response, user only sees content after it is generated
  // async message(message = "I want a smart contract for purchasing NFTs") {
  //   try {
  //     this.messages.push({ content: message, role: "user" });
  //     const params: OpenAI.ChatCompletionCreateParams = {
  //       model: "deepseek-coder",
  //       messages: this.messages,
  //       max_tokens: 2048,
  //       temperature: 1,
  //       top_p: 1,
  //       stream: false,
  //     }
  //     const chatCompletion: OpenAI.Chat.ChatCompletion = await this.deepseekClient.chat.completions.create(params);
  //     this.messages.push({ content: chatCompletion.choices[0].message.content, role: "assistant" });
  //     return chatCompletion.choices[0].message.content;
  //   } catch (error){
  //     console.error("Error in message method: ", error);
  //     throw error;
  //   }
  // }
}
