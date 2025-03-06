
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, X, Check } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  initialValue?: string | null;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, initialValue }) => {
  const [apiKey, setApiKey] = useState<string>(initialValue || '');
  const [isVisible, setIsVisible] = useState<boolean>(!initialValue);
  const [isSaved, setIsSaved] = useState<boolean>(!!initialValue);

  useEffect(() => {
    if (initialValue) {
      setApiKey(initialValue);
      setIsSaved(true);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    
    // Basic format validation
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key (should start with 'sk-')",
        variant: "destructive",
      });
      return;
    }
    
    onApiKeySet(apiKey);
    setIsSaved(true);
    setIsVisible(false);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  if (!isVisible && isSaved) {
    return (
      <motion.div 
        className="flex items-center justify-center p-2 my-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button 
          className="flex items-center space-x-2 text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
          onClick={() => setIsVisible(true)}
        >
          <Check size={12} />
          <span>API Key Set</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full p-4 my-2 bg-white rounded-lg border border-analyst-border shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm flex items-center">
          <Key size={16} className="mr-2 text-analyst-accent" />
          OpenAI API Key
        </h3>
        {isVisible && (
          <button 
            className="text-gray-400 hover:text-gray-600" 
            onClick={() => {
              if (isSaved) {
                setIsVisible(false);
              }
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="password"
            className="w-full p-2 px-3 text-sm rounded border border-analyst-border focus:ring-2 focus:ring-analyst-accent focus:border-transparent transition-all"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-analyst-text mt-1">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-xs px-4 py-2 bg-analyst-accent text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save API Key
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApiKeyInput;
