
import React from 'react';

interface Category {
  name: string;
  isComplete: boolean;
  keywords: string[];
}

interface AnalysisData {
  metrics: {
    revenue: string;
    growth: string;
    customers: string;
    churn: string;
  };
  insights: string[];
  categories: Category[];
}

interface AnalysisManagerProps {
  analysis: AnalysisData | null;
  onAnalysisUpdate: (updatedAnalysis: AnalysisData) => void;
  setIsPRDAvailable: (available: boolean) => void;
}

const AnalysisManager: React.FC<AnalysisManagerProps> = ({ analysis, onAnalysisUpdate, setIsPRDAvailable }) => {
  
  const updateCategoriesBasedOnMessage = (message: string) => {
    if (!analysis) return;
    
    const updatedCategories = [...analysis.categories];
    let categoriesUpdated = false;
    
    updatedCategories.forEach(category => {
      if (!category.isComplete) {
        const foundKeyword = category.keywords.some(keyword => 
          message.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (foundKeyword) {
          category.isComplete = true;
          categoriesUpdated = true;
        }
      }
    });
    
    if (categoriesUpdated) {
      const updatedAnalysis = {
        ...analysis,
        categories: updatedCategories
      };
      
      onAnalysisUpdate(updatedAnalysis);
      
      // After 4 categories are complete, make PRD available
      const completedCount = updatedCategories.filter(cat => cat.isComplete).length;
      if (completedCount >= 4) {
        setIsPRDAvailable(true);
      }
    }
  };

  return { updateCategoriesBasedOnMessage };
};

export default AnalysisManager;
