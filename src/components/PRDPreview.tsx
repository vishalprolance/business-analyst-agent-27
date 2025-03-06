
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { slideUpAnimation } from '@/utils/animation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PRDPreviewProps {
  content: string;
  onConfirm: (updatedContent: string) => void;
  onCancel: () => void;
}

const PRDPreview: React.FC<PRDPreviewProps> = ({ content, onConfirm, onCancel }) => {
  const [editedContent, setEditedContent] = useState(content);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      variants={slideUpAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-analyst-accent">Product Requirements Document Preview</h2>
        
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
            <Button onClick={() => onConfirm(editedContent)}>Generate Files</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PRDPreview;
