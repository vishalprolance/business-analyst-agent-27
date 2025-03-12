import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, X, Check, ChevronDown } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { LLMModel, availableModels } from '@/services/openai';

interface ApiKeyInputProps {
  onApiKeySet: (modelId: string, apiKey: string) => void;
  onModelSelect: (modelId: string) => void;
  initialValues?: Record<string, string>;
  selectedModel?: LLMModel;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  onApiKeySet, 
  onModelSelect,
  initialValues = {}, 
  selectedModel 
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<LLMModel>(selectedModel || availableModels[0]);

  useEffect(() => {
    if (selectedModel) {
      setCurrentModel(selectedModel);
    }
    
    // Set initial API key for the current model if available
    if (initialValues && Object.keys(initialValues).length > 0) {
      const modelKey = initialValues[currentModel.id];
      if (modelKey) {
        setApiKey(modelKey);
        setIsSaved(true);
      } else {
        setApiKey('');
        setIsSaved(false);
      }
    }
  }, [selectedModel, initialValues, currentModel.id]);

  // Update API key input when model changes
  useEffect(() => {
    const modelKey = initialValues[currentModel.id];
    setApiKey(modelKey || '');
    setIsSaved(!!modelKey);
  }, [currentModel, initialValues]);

  const handleModelSelect = (model: LLMModel) => {
    setCurrentModel(model);
    onModelSelect(model.id);
    setIsDropdownOpen(false);
    
    // Update API key field with the selected model's API key
    const modelKey = initialValues[model.id];
    setApiKey(modelKey || '');
    setIsSaved(!!modelKey);
  };

  // Update validation for different API keys
  const isValidApiKey = (key: string, provider: string): boolean => {
    key = key.trim();
    
    // Return false for empty keys
    if (!key) return false;
    
    switch (provider) {
      case 'openai':
        // OpenAI API keys start with 'sk-'
        return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
      case 'anthropic':
        // Anthropic API keys start with 'sk-ant-'
        return /^sk-ant-[a-zA-Z0-9]{32,}$/.test(key);
      case 'perplexity':
        // Perplexity API keys have a specific format
        return /^pplx-[a-zA-Z0-9]{32,}$/.test(key);
      case 'mistral':
        // Mistral API keys start with 'mist-'
        return /^mist-[a-zA-Z0-9]{32,}$/.test(key);
      default:
        // Generic validation - at least 16 characters
        return key.length >= 16;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: `Please enter a ${currentModel.provider} API key`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate based on provider
    if (!isValidApiKey(apiKey, currentModel.provider)) {
      toast({
        title: "Invalid API Key",
        description: `Please enter a valid ${currentModel.provider} API key`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      onApiKeySet(currentModel.id, apiKey.trim());
      setIsSaved(true);
      
      toast({
        title: "API Key Saved",
        description: `Your ${currentModel.name} API key has been saved`,
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full px-4 py-2 bg-white bg-opacity-75 border-b border-analyst-border z-10"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <button
              type="button"
              className="flex items-center justify-between w-full px-3 py-1 text-xs border border-analyst-border rounded bg-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{currentModel.name}</span>
              <ChevronDown size={14} className="ml-2" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-analyst-border rounded shadow-lg z-20">
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className="w-full px-3 py-2 text-xs text-left hover:bg-analyst-light"
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Key size={14} className="text-analyst-text" />
              </div>
              <input
                type="password"
                className="w-full pl-9 pr-3 py-1 text-xs rounded border border-analyst-border focus:ring-1 focus:ring-analyst-accent focus:border-transparent transition-all"
                placeholder={`Enter your ${currentModel.provider} API key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className={`text-xs px-3 py-1 ${isLoading ? 'bg-gray-400' : 'bg-analyst-accent hover:bg-blue-600'} text-white rounded transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
        
        <div className="text-xs text-analyst-text mt-1 opacity-75 space-y-1">
          <p>
            <strong>Note:</strong> Enter a valid API key for {currentModel.name}.
            {currentModel.provider === 'openai' && " (starts with 'sk-')"}
            {currentModel.provider === 'anthropic' && " (starts with 'sk-ant-')"}
            {currentModel.provider === 'perplexity' && " (starts with 'pplx-')"}
            {currentModel.provider === 'mistral' && " (starts with 'mist-')"}
          </p>
          <p>
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default ApiKeyInput;
