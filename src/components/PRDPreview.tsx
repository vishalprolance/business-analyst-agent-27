
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface PRDPreviewProps {
  content: string;
  onConfirm: (updatedContent: string) => void;
  onCancel: () => void;
}

const PRDPreview: React.FC<PRDPreviewProps> = ({ content, onConfirm, onCancel }) => {
  // Store the edited content in state
  const [editedContent, setEditedContent] = useState(content);

  // Handle confirmation and pass the edited content back
  const handleConfirm = () => {
    // Ensure content is properly formatted and doesn't have duplicate sections
    const cleanedContent = removeDuplicateSections(editedContent);
    onConfirm(cleanedContent);
  };

  // Function to identify and remove duplicate sections in the content
  const removeDuplicateSections = (text: string): string => {
    // Split content by markdown headings (## Section Title)
    const sections = text.split(/^##\s+/m);
    
    // Track section titles we've seen
    const seenSections = new Set<string>();
    const cleanedSections: string[] = [];
    
    // Process each section
    sections.forEach((section, index) => {
      // Skip empty sections
      if (!section.trim()) return;
      
      // For the first item (intro content), just add it
      if (index === 0) {
        cleanedSections.push(section);
        return;
      }
      
      // Get section title (first line)
      const lines = section.split('\n');
      const title = lines[0].trim();
      
      // If we haven't seen this section title, add it
      if (!seenSections.has(title)) {
        seenSections.add(title);
        cleanedSections.push('## ' + section);
      }
    });
    
    // Join everything back together
    return cleanedSections.join('\n');
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      variants={slideUpAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-analyst-accent">Product Requirements Document Preview</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-analyst-text mb-4">
          Please review and make any necessary changes to your document before generating the final files.
        </p>
        
        <div className="flex-1 overflow-auto mb-4 border border-gray-200 rounded-md">
          <Textarea
            className="w-full h-full p-4 min-h-[400px] font-mono text-sm focus-visible:ring-0"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xs text-analyst-text">
              Both .md and .doc files will be generated
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleConfirm}>Generate Files</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PRDPreview;
