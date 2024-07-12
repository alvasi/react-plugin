import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export class RemixClient extends PluginClient {

  constructor() {
    super()
    this.methods = ['createTemplate', 'checkVulnerabilities']
    createClient(this)
  }

  async createTemplate() {
    try {
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{ role: "system", content: "You are going to recommend a smart contract template depending on the user's prompt" }, { role: "user", content: "say hello world" }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating template: ', error);
      throw new Error('Failed to generate template');
    }
  }

  async checkVulnerabilities() {
    try {
      const fileName = await this.call('fileManager', 'getCurrentFile');
      const prompt = await this.call('fileManager', 'readFile', fileName);
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{ role: "system", content: "You are a useful assistant" }, { role: "user", content: "say hello world" }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error checking vulnerabilities:', error);
      throw new Error('Failed to check vulnerabilities');
    }
  }
}

export default new RemixClient();
