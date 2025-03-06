
import { toast } from "@/hooks/use-toast";

// Define types for OpenAI requests and responses
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  // Hardcoded API key - Replace with your actual API key
  private apiKey: string = "sk-yourapikeygoeshere";
  private systemPrompt: string;
  private conversation: OpenAIMessage[] = [];
  private model: string = "gpt-4o";

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.resetConversation();
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public resetConversation() {
    this.conversation = [
      {
        role: 'system',
        content: this.systemPrompt
      }
    ];
  }

  public async sendMessage(userMessage: string): Promise<string> {
    // Add user message to conversation
    this.conversation.push({
      role: 'user',
      content: userMessage
    });

    try {
      const requestBody: OpenAICompletionRequest = {
        model: this.model,
        messages: this.conversation,
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data: OpenAICompletionResponse = await response.json();
      const assistantMessage = data.choices[0].message.content;
      
      // Add assistant response to conversation history
      this.conversation.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to communicate with OpenAI",
        variant: "destructive",
      });
      throw error;
    }
  }

  public getConversationHistory(): OpenAIMessage[] {
    return [...this.conversation];
  }
}
