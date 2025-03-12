
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
  // Default API key placeholder - will be replaced by user's key
  private apiKey: string = "";
  private systemPrompt: string;
  private conversation: OpenAIMessage[] = [];
  private model: string = "gpt-4o";

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.resetConversation();
    
    // Try to load API key from localStorage if available
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem('openai_api_key', key);
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
    // Check if API key is set
    if (!this.apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key before sending messages",
        variant: "destructive",
      });
      throw new Error("API key not set");
    }

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

      console.log("Sending request to OpenAI API...");
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Received response:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "Failed to parse error response" } }));
        const errorMessage = errorData.error?.message || `API Error (${response.status})`;
        
        console.error("OpenAI API Error:", errorMessage);
        
        // Handle common error codes
        let userFriendlyMessage: string;
        switch (response.status) {
          case 401:
            userFriendlyMessage = "Invalid API key. Please check your OpenAI API key and try again.";
            break;
          case 429:
            userFriendlyMessage = "Rate limit exceeded. Please try again later.";
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            userFriendlyMessage = "OpenAI service is currently unavailable. Please try again later.";
            break;
          default:
            userFriendlyMessage = `Error: ${errorMessage}`;
        }
        
        toast({
          title: "API Error",
          description: userFriendlyMessage,
          variant: "destructive",
        });
        
        throw new Error(userFriendlyMessage);
      }

      const data: OpenAICompletionResponse = await response.json();
      console.log("Successfully parsed OpenAI response");
      
      const assistantMessage = data.choices[0].message.content;
      
      // Log token usage
      if (data.usage) {
        console.log(`Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
      }
      
      // Add assistant response to conversation history
      this.conversation.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // If this is a network error (fetch failed entirely), show a different error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Network Error",
          description: "Failed to connect to OpenAI API. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error instanceof Error && !error.message.includes("API Error")) {
        // Only show toast if we didn't already show one in the code above
        toast({
          title: "API Error",
          description: error instanceof Error ? error.message : "Failed to communicate with OpenAI",
          variant: "destructive",
        });
      }
      
      throw error;
    }
  }

  public getConversationHistory(): OpenAIMessage[] {
    return [...this.conversation];
  }
}
