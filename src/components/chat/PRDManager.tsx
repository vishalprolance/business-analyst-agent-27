
import React, { useState } from 'react';
import { generatePRD, generateWordDocumentBlob, generateMarkdownBlob, downloadDocument } from '@/utils/documentGenerator';
import { useToast } from '@/hooks/use-toast';
import PRDPreview from '@/components/PRDPreview';
import { Message } from '@/components/ChatInterface';

interface PRDManagerProps {
  analysis: any;
  messages: Message[];
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const PRDManager: React.FC<PRDManagerProps> = ({ analysis, messages, buttonRef }) => {
  const [showPRDPreview, setShowPRDPreview] = useState(false);
  const [prdContent, setPrdContent] = useState('');
  const { toast } = useToast();

  const handleGeneratePRD = () => {
    if (!analysis) return;
    
    try {
      console.log("PRDManager.handleGeneratePRD: Generating PRD content...");
      const content = generatePRD(analysis, messages);
      setPrdContent(content);
      setShowPRDPreview(true);
      console.log("PRD preview ready to show");
    } catch (error) {
      console.error("Error generating PRD preview:", error);
      toast({
        title: "Error",
        description: "Failed to generate the document preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePRDConfirmation = (updatedContent: string) => {
    try {
      // Generate and download both files
      const markdownBlob = generateMarkdownBlob(updatedContent);
      const wordDocBlob = generateWordDocumentBlob(updatedContent);
      
      // Download both files
      downloadDocument(markdownBlob, 'PRD.md');
      downloadDocument(wordDocBlob, 'PRD.doc');
      
      setShowPRDPreview(false);
      
      toast({
        title: "Documents Generated",
        description: "Your PRD files have been downloaded in both markdown and Word formats.",
      });
    } catch (error) {
      console.error("Error generating documents:", error);
      toast({
        title: "Error",
        description: "Failed to generate the documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePRDCancellation = () => {
    setShowPRDPreview(false);
    setPrdContent('');
  };

  // Set up event listener effect in the parent component
  
  // Expose the handler to be called externally
  React.useEffect(() => {
    if (buttonRef.current) {
      // Cleanup existing listeners and register new one
      const handler = handleGeneratePRD;
      buttonRef.current.addEventListener('click', handler);
      
      return () => {
        if (buttonRef.current) {
          buttonRef.current.removeEventListener('click', handler);
        }
      };
    }
  }, [analysis, messages, buttonRef]);

  return (
    <>
      {showPRDPreview && (
        <PRDPreview 
          content={prdContent} 
          onConfirm={handlePRDConfirmation} 
          onCancel={handlePRDCancellation} 
        />
      )}
    </>
  );
};

export default PRDManager;
