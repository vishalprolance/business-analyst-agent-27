
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
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved",
    });
  };

  return (
    <motion.div
      className="w-full px-4 py-2 bg-white bg-opacity-75 border-b border-analyst-border z-10"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Key size={14} className="text-analyst-text" />
            </div>
            <input
              type="password"
              className="w-full pl-9 pr-3 py-1 text-xs rounded border border-analyst-border focus:ring-1 focus:ring-analyst-accent focus:border-transparent transition-all"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="text-xs px-3 py-1 bg-analyst-accent text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </form>
      <p className="text-xs text-analyst-text mt-1 opacity-75">
        Your API key is stored locally and never sent to our servers.
      </p>
    </motion.div>
  );
};

export default ApiKeyInput;
