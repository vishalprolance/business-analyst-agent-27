
import React, { useState } from 'react';
import ApiKeyInput from '@/components/ApiKeyInput';
import { LLMModel, OpenAIService } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyManagerProps {
  openAIService: OpenAIService;
  selectedModel: LLMModel;
  onModelSelect: (modelId: string) => void;
  showApiKeyInput: boolean;
  setShowApiKeyInput: (show: boolean) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  openAIService,
  selectedModel,
  onModelSelect,
  showApiKeyInput,
  setShowApiKeyInput
}) => {
  const { toast } = useToast();

  const handleApiKeySet = (modelId: string, apiKey: string) => {
    openAIService.setApiKey(modelId, apiKey);
    
    toast({
      title: "API Key Updated",
      description: "Your API key has been saved successfully",
    });
  };

  const handleModelSelect = (modelId: string) => {
    onModelSelect(modelId);
    
    toast({
      title: "Model Changed",
      description: `Now using ${openAIService.getSelectedModel().name}`,
    });
  };

  return (
    <>
      {showApiKeyInput && (
        <ApiKeyInput 
          onApiKeySet={handleApiKeySet}
          onModelSelect={handleModelSelect}
          initialValues={openAIService.getAllApiKeys()}
          selectedModel={selectedModel}
        />
      )}
    </>
  );
};

export default ApiKeyManager;
