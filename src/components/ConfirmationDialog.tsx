
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Archive } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 p-2 rounded-full mr-3">
            <Archive className="h-6 w-6 text-analyst-accent" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        <p className="mb-6 text-gray-600">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 flex items-center hover:bg-gray-50 transition-colors duration-300"
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-analyst-accent text-white rounded-full flex items-center hover:bg-blue-600 transition-colors duration-300"
          >
            <Check size={16} className="mr-2" />
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationDialog;
