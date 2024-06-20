import { PluginClient } from '@remixproject/plugin';
import { createClient } from '@remixproject/plugin-webview';

export class RemixClient extends PluginClient {
  constructor() {
    super()
    this.methods = ['getCurrentFileContent', 'generateCode']
    createClient(this)
  }

  async getCurrentFileContent() {
    try {
      const fileName = await this.call('fileManager', 'getCurrentFile');
      const prompt = await this.call('fileManager', 'readFile', fileName);
      return prompt;
    } catch (error) {
      console.error('Error getting file content:', error);
      throw new Error('Failed to get file content');
    }
  }

  async generateCode(prompt) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo-16k",
      });
      return completion.choices[0].message.content; // Assuming the API response format
    } catch (error) {
      console.error('Error generating text from OpenAI:', error);
      throw new Error('Failed to generate text from OpenAI');
    }
  }
}

export default new RemixClient();