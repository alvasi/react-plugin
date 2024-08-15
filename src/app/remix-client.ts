// import { PluginClient } from '@remixproject/plugin';
// import { createClient } from '@remixproject/plugin-webview';
// import { Client } from '@gradio/client';
// import axios from 'axios';
// import OpenAI from 'openai';
// import Anthropic from '@anthropic-ai/sdk';

// export class RemixClient extends PluginClient {
//   // gradioClient: Client;
//   deepseekClient: OpenAI;
//   // claudeClient: Anthropic;
//   messages = [];

//   constructor() {
//     super();
//     this.methods = ['init','message'];
//     createClient(this);
//   }

//   async init() {
//     // this.gradioClient = await Client.connect("alvasi/test");
//     this.deepseekClient = new OpenAI({
//       apiKey: "sk-7885a3110d2646f0bfb7e8a5732045fe", //process.env.DEEPSEEK_API
//       baseURL: "https://api.deepseek.com",
//       dangerouslyAllowBrowser: true
//     })
//     this.messages.push({ content: "You are a useful coder that codes secure solidity smart contracts based on user's prompt. Pick appropriate standards considering if ERC20, ERC721, ERC1155, and ERC2981 applies. Avoid vulnerabilities such as reentrancy with check-effects-interaction, avoid low level calls, be careful of gas costs (e.g., avoid for loops over dynamic arrays) and try to use more different variable names. Implement as much as possible. Ask user if further clarification for functionality is needed", role: "system" })
//     // this.messages.push({ content: "You are a skilled Solidity smart contract developer tasked with creating secure and efficient smart contracts based on user prompts. Select the appropriate token standard(s) from ERC20 (fungible tokens), ERC721 (NFTs), ERC1155 (multi-token), and ERC2981 (royalty). Implement secure coding practices: Use the check-effects-interaction pattern to prevent reentrancy attacks; Avoid low-level calls unless absolutely necessary; Be mindful of gas costs, especially with loops and dynamic arrays; Use SafeMath library for arithmetic operations to prevent overflow and underflow; Implement access control using OpenZeppelin's Ownable or AccessControl contracts. Use named imports (import {ERC20} from \"@openzeppelin/...\") Avoid similar variable names within the same contract. If any part of the user's requirements is unclear or requires further clarification, ask for more information.", role: "system" });
//     // this.claudeClient = new Anthropic({
//     //   apiKey: "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"
//     // });
//   }

//   async message(message = "I want a smart contract for purchasing NFTs") {
//     // try {
//     //   const result = await this.gradioClient.predict("/chat", {
//     //     message: message,
//     //     system_message: "You are a useful assistant that recommends a solidity smart contract template based on the user's prompt",
//     //     max_tokens: 1000,
//     //     temperature: 0.7,
//     //     top_p: 0.95,
//     //   });
//     //   if (result.data) {
//     //     console.log("Response data found");
//     //     return result.data;
//     //   } else {
//     //     console.log("No response data found.");
//     //   }
//     // } catch (error) {
//     //   console.error('Error generating template: ', error);
//     //   throw new Error('Failed to generate template');
//     // }

//     // const data = JSON.stringify({
//     //   "messages": [
//     //     {
//     //       "content": "You are a useful coder that codes secure solidity smart contracts based on user's prompt. Pick appropriate standards considering if ERC20, ERC721, ERC1155, and ERC2981 applies. Avoid reentrancy, integer over/underflow etc. Implement as much as possible. Ask user if further clarification for functionality is needed",
//     //       "role": "system"
//     //     },
//     //     {
//     //       "content": message,
//     //       "role": "user"
//     //     }
//     //   ],
//     //   "model": "deepseek-coder",
//     //   "frequency_penalty": 0,
//     //   "max_tokens": 2048,
//     //   "presence_penalty": 0,
//     //   "stop": null,
//     //   "stream": false,
//     //   "temperature": 1,
//     //   "top_p": 1,
//     //   "logprobs": false,
//     //   "top_logprobs": null
//     // });

//     // const config = {
//     //   method: 'post',
//     //   maxBodyLength: Infinity,
//     //   url: 'https://api.deepseek.com/chat/completions',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //     'Accept': 'application/json',
//     //     'Authorization': `Bearer sk-7885a3110d2646f0bfb7e8a5732045fe`
//     //   },
//     //   data: data
//     // };

//     // try {
//     //   const response = await axios(config);
//     //   console.log("Response data found", response.data.choices[0].message.content);
//     //   return response.data.choices[0].message.content;
//     // } catch (error) {
//     //   console.error("Error in message method: ", error);
//     //   throw error;
//     // }

//     try {
//       this.messages.push({ content: message, role: "user" });
//       const params: OpenAI.ChatCompletionCreateParams = {
//         model: "deepseek-coder",
//         messages: this.messages,
//         max_tokens: 2048,
//         temperature: 1,
//         top_p: 1,
//         stream: false,
//       }
//       const chatCompletion: OpenAI.Chat.ChatCompletion = await this.deepseekClient.chat.completions.create(params);
//       this.messages.push({ content: chatCompletion.choices[0].message.content, role: "assistant" });
//       return chatCompletion.choices[0].message.content;
//     } catch (error){
//       console.error("Error in message method: ", error);
//       throw error;
//     }

//     // try {
//     //   this.messages.push({ role: "user", content: message });
//     //   const params: Anthropic.MessageCreateParams = {
//     //     model: "claude-3-5-sonnet-20240620",
//     //     max_tokens: 2048,
//     //     messages: this.messages,
//     //     system: "You are a useful coder that codes secure solidity smart contracts based on user's prompt. Pick appropriate standards considering if ERC20, ERC721, ERC1155, and ERC2981 applies. Avoid vulnerabilities such as reentrancy with check-effects-interaction, avoid low level calls, be careful of gas costs (e.g., avoid for loops over dynamic arrays) and try to use more different variable names. Implement as much as possible. Ask user if further clarification for functionality is needed"
//     //   }
//     // } catch (error) {
//     //   console.error("Error in anthropic message method: ", error);
//     //   throw error;
//     // }
//   }
// }
