
import React, { useState, useRef } from 'react';
import { Send, Mic, FileUp, StopCircle, Paperclip } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload?: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onFileUpload }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Handle sending message
  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    console.log("Sending message from input:", trimmedInput);
    onSendMessage(trimmedInput);
    setInput('');
    setUploadedFileName(null);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a Word document
    if (!file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a Microsoft Word document (.doc or .docx)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFileName(file.name);
    
    if (onFileUpload) {
      onFileUpload(file);
    }

    toast({
      title: "File uploaded",
      description: `${file.name} has been attached to your message`,
    });
  };

  // Voice command handling
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Use Speech Recognition API
        try {
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.lang = 'en-US';
          
          // Convert audio to text using Web Speech API
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + ' ' + transcript.trim());
            
            toast({
              title: "Voice command recognized",
              description: transcript,
            });
          };
          
          recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            toast({
              title: "Voice recognition failed",
              description: "Could not process voice command. Please try again.",
              variant: "destructive",
            });
          };
          
          recognition.start();
        } catch (error) {
          console.error('Speech recognition not supported', error);
          toast({
            title: "Voice recognition not supported",
            description: "Your browser doesn't support voice recognition.",
            variant: "destructive",
          });
        }
        
        // Clean up the media stream
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your message now...",
      });
    } catch (error) {
      console.error('Error accessing microphone', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Trigger file input click
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 border-t border-analyst-border flex items-center space-x-2 z-10 bg-white bg-opacity-90">
      {/* File upload input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".doc,.docx"
        onChange={handleFileUpload}
        aria-label="Upload document"
      />
      
      {/* File attachment button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-9 w-9 text-analyst-text hover:text-analyst-accent"
        onClick={handleAttachClick}
        aria-label="Attach document"
      >
        <Paperclip size={18} />
      </Button>
      
      {/* Voice command button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className={`rounded-full h-9 w-9 ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'text-analyst-text hover:text-analyst-accent'}`}
        onClick={isRecording ? stopRecording : startRecording}
        aria-label={isRecording ? "Stop recording" : "Voice input"}
      >
        {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
      </Button>
      
      {/* Text input field */}
      <div className="flex-1 relative">
        <input
          type="text"
          className="w-full p-2 px-4 rounded-full border border-analyst-border bg-white focus:ring-2 focus:ring-analyst-accent focus:border-transparent transition-all"
          placeholder="Tell me about your app idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
          data-testid="chat-input"
        />
        
        {/* Show file name if uploaded */}
        {uploadedFileName && (
          <div className="absolute -top-8 left-0 bg-blue-50 text-analyst-accent p-1 px-3 rounded-full text-xs flex items-center">
            <FileUp size={12} className="mr-1" />
            {uploadedFileName}
          </div>
        )}
      </div>
      
      {/* Send button */}
      <Button 
        variant={input.trim() ? "default" : "secondary"}
        size="icon"
        className={`rounded-full h-9 w-9 ${
          input.trim()
            ? 'bg-analyst-accent hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-400'
        }`}
        onClick={handleSend}
        disabled={!input.trim()}
        aria-label="Send message"
        data-testid="send-button"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

// Add SpeechRecognition type definition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default ChatInput;
