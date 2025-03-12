import { toast } from "@/hooks/use-toast";

// Define types for OpenAI requests and responses
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'perplexity' | 'mistral';
  apiEndpoint: string;
  description: string;
}

export const availableModels: LLMModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o (OpenAI)',
    provider: 'openai',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    description: 'OpenAI\'s powerful multimodal model'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini (OpenAI)',
    provider: 'openai',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    description: 'Faster, cheaper version of GPT-4o'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus (Anthropic)',
    provider: 'anthropic',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    description: 'Anthropic\'s most powerful model'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large (Mistral)',
    provider: 'mistral',
    apiEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    description: 'Mistral\'s large language model'
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium (Mistral)',
    provider: 'mistral',
    apiEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    description: 'Balanced performance and efficiency'
  },
  {
    id: 'llama-3.1-sonar-small-128k-online',
    name: 'Llama 3.1 Sonar (Perplexity)',
    provider: 'perplexity',
    apiEndpoint: 'https://api.perplexity.ai/chat/completions',
    description: 'Perplexity\'s 8B parameter model with online search'
  }
];

interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface AnthropicCompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface PerplexityCompletionRequest {
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

interface AnthropicCompletionResponse {
  id: string;
  type: string;
  content: { type: string; text: string }[];
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface PerplexityCompletionResponse {
  id: string;
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
  // Default API key placeholder
  private apiKeys: Record<string, string> = {};
  private systemPrompt: string;
  private conversation: OpenAIMessage[] = [];
  private selectedModel: LLMModel = availableModels[0]; // Default to first model (GPT-4o)

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.resetConversation();
    
    // Try to load API keys and selected model from localStorage if available
    this.loadSavedSettings();
  }

  private loadSavedSettings() {
    // Load API keys
    const savedApiKeys = localStorage.getItem('llm_api_keys');
    if (savedApiKeys) {
      try {
        this.apiKeys = JSON.parse(savedApiKeys);
      } catch (error) {
        console.error("Failed to parse saved API keys:", error);
        this.apiKeys = {};
      }
    }

    // Load selected model
    const savedModelId = localStorage.getItem('selected_llm_model');
    if (savedModelId) {
      const foundModel = availableModels.find(model => model.id === savedModelId);
      if (foundModel) {
        this.selectedModel = foundModel;
      }
    }
  }

  public setApiKey(modelId: string, key: string) {
    this.apiKeys[modelId] = key;
    // Save to localStorage for persistence
    localStorage.setItem('llm_api_keys', JSON.stringify(this.apiKeys));
  }

  public getApiKey(modelId?: string): string {
    const targetModelId = modelId || this.selectedModel.id;
    return this.apiKeys[targetModelId] || "";
  }

  public getAllApiKeys(): Record<string, string> {
    return { ...this.apiKeys };
  }

  public getSelectedModel(): LLMModel {
    return this.selectedModel;
  }

  public setSelectedModel(modelId: string) {
    const foundModel = availableModels.find(model => model.id === modelId);
    if (foundModel) {
      this.selectedModel = foundModel;
      localStorage.setItem('selected_llm_model', modelId);
    } else {
      console.error(`Model with ID ${modelId} not found`);
    }
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
    const modelId = this.selectedModel.id;
    const provider = this.selectedModel.provider;
    const apiKey = this.getApiKey(modelId);

    // Check if API key is set
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: `Please set your ${this.selectedModel.name} API key before sending messages`,
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
      let assistantMessage: string;
      console.log(`Sending request to ${provider} API using ${modelId} model...`);
      
      // Different handling based on provider
      switch (provider) {
        case 'openai':
          assistantMessage = await this.handleOpenAIRequest(apiKey);
          break;
        case 'anthropic':
          assistantMessage = await this.handleAnthropicRequest(apiKey);
          break;
        case 'perplexity':
          assistantMessage = await this.handlePerplexityRequest(apiKey);
          break;
        case 'mistral':
          assistantMessage = await this.handleMistralRequest(apiKey);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      // Add assistant response to conversation history
      this.conversation.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      this.handleApiError(error, provider);
      throw error;
    }
  }

  private async handleOpenAIRequest(apiKey: string): Promise<string> {
    const requestBody: OpenAICompletionRequest = {
      model: this.selectedModel.id,
      messages: this.conversation,
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await fetch(this.selectedModel.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Received response:", response.status);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data: OpenAICompletionResponse = await response.json();
    console.log("Successfully parsed OpenAI response");
    
    if (data.usage) {
      console.log(`Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return data.choices[0].message.content;
  }

  private async handleAnthropicRequest(apiKey: string): Promise<string> {
    const requestBody: AnthropicCompletionRequest = {
      model: this.selectedModel.id,
      messages: this.conversation,
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await fetch(this.selectedModel.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Received response:", response.status);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data: AnthropicCompletionResponse = await response.json();
    console.log("Successfully parsed Anthropic response");
    
    if (data.usage) {
      console.log(`Token usage - Input: ${data.usage.input_tokens}, Output: ${data.usage.output_tokens}`);
    }
    
    // Extract the text content from the first content item
    return data.content[0]?.text || "";
  }

  private async handlePerplexityRequest(apiKey: string): Promise<string> {
    const requestBody: PerplexityCompletionRequest = {
      model: this.selectedModel.id,
      messages: this.conversation,
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await fetch(this.selectedModel.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Received response:", response.status);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data: PerplexityCompletionResponse = await response.json();
    console.log("Successfully parsed Perplexity response");
    
    if (data.usage) {
      console.log(`Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return data.choices[0].message.content;
  }

  private async handleMistralRequest(apiKey: string): Promise<string> {
    const requestBody: OpenAICompletionRequest = {
      model: this.selectedModel.id,
      messages: this.conversation,
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await fetch(this.selectedModel.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log("Received response:", response.status);

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data: OpenAICompletionResponse = await response.json();
    console.log("Successfully parsed Mistral response");
    
    if (data.usage) {
      console.log(`Token usage - Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens}, Total: ${data.usage.total_tokens}`);
    }
    
    return data.choices[0].message.content;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to parse error response" } }));
    const errorMessage = errorData.error?.message || `API Error (${response.status})`;
    
    console.error(`LLM API Error: ${errorMessage}`);
    
    // Handle common error codes
    let userFriendlyMessage: string;
    switch (response.status) {
      case 401:
        userFriendlyMessage = `Invalid API key for ${this.selectedModel.name}. Please check your API key and try again.`;
        break;
      case 429:
        userFriendlyMessage = `Rate limit exceeded for ${this.selectedModel.provider}. Please try again later.`;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        userFriendlyMessage = `${this.selectedModel.provider} service is currently unavailable. Please try again later.`;
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

  private handleApiError(error: unknown, provider: string): void {
    console.error(`Error calling ${provider} API:`, error);
    
    // If this is a network error (fetch failed entirely), show a different error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast({
        title: "Network Error",
        description: `Failed to connect to ${provider} API. Please check your internet connection.`,
        variant: "destructive",
      });
    } else if (error instanceof Error && !error.message.includes("API Error")) {
      // Only show toast if we didn't already show one in the code above
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : `Failed to communicate with ${provider}`,
        variant: "destructive",
      });
    }
  }

  public getConversationHistory(): OpenAIMessage[] {
    return [...this.conversation];
  }
}
