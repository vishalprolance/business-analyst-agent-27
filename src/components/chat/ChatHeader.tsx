
import React from 'react';
import { Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { generateDetailedRoadmap, generateMarkdownBlob, downloadDocument } from '@/utils/documentGenerator';
import { toast } from "@/components/ui/use-toast";

interface ChatHeaderProps {
  onApiKeyClick: () => void;
  onGeneratePRD: () => void;
  isPRDAvailable: boolean;
  completedCategories: number;
  totalCategories: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onApiKeyClick, 
  onGeneratePRD, 
  isPRDAvailable,
  completedCategories,
  totalCategories
}) => {
  const handleGenerateRoadmap = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      // Generate the detailed roadmap content
      const roadmapContent = generateDetailedRoadmap({}, []);
      
      // Create a markdown blob and download it
      const blob = generateMarkdownBlob(roadmapContent);
      downloadDocument(blob, 'markdownplan.md');
      
      // Show success toast
      toast({
        title: "Development Roadmap Generated",
        description: "Your detailed task-level development plan has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Error Generating Roadmap",
        description: "There was a problem creating your development roadmap.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-analyst-border z-10 w-full">
      <div className="flex items-center space-x-3">
        <h2 className="font-medium">Business Analyst Agent</h2>
        <span className="text-xs px-2 py-1 bg-analyst-light text-analyst-accent rounded-full">
          Progress: {completedCategories}/{totalCategories}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mr-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-sm text-analyst-text">Online</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onApiKeyClick}
          className="h-8"
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          API Key
        </Button>
        
        {isPRDAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex space-x-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateRoadmap}
              className="border-analyst-accent text-analyst-accent hover:bg-analyst-light h-8"
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Master Planning
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onGeneratePRD}
              className="bg-analyst-accent hover:bg-blue-600 text-white h-8"
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Generate Master Plan
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
