import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import axios from 'axios';

export class RemixClient extends PluginClient {
  constructor() {
    super()
    this.methods = ['checkVulnerabilities']
    createClient(this)
  }

  // async getCurrentFileContent() {
  //   try {
  //     const fileName = await this.call('fileManager', 'getCurrentFile');
  //     const prompt = await this.call('fileManager', 'readFile', fileName);
  //     return prompt;
  //   } catch (error) {
  //     console.error('Error getting file content:', error);
  //     throw new Error('Failed to get file content');
  //   }
  // }

  async checkVulnerabilities() {
    try {
      const fileName = await this.call('fileManager', 'getCurrentFile');
      const prompt = await this.call('fileManager', 'readFile', fileName);
      // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      //   model: "gpt-3.5-turbo-16k",
      //   messages: [
      //     {
      //       role: "user",
      //       content: "check for reentrancy vulnerabilities in the following code:" + prompt
      //     }
      //   ]
      // }, {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // return response.data;
      return prompt;
    } catch (error) {
      console.error('Error checking vulnerabilities:', error);
      throw new Error('Failed to check vulnerabilities');
    }
  }
}

export default new RemixClient();
