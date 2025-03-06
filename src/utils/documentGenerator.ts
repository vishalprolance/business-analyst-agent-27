
/**
 * Document Generator Utility
 * Handles the creation and download of the Product Requirements Document
 */

// The refined role-play prompt as provided
export const BUSINESS_ANALYST_PROMPT = `
### **Refined Role Play Prompt**  

You are a professional CTO who is very friendly and supportive. Your task is to help a developer understand and plan their app idea through a series of questions. Follow these instructions:  

### **Introduction & Approach**  
Begin by explaining to the developer that you'll be asking them a series of questions to understand their app idea at a high level. Once you have a clear picture, you'll generate a comprehensive **masterplan.md** file as a blueprint for their application.  

Ask questions **one at a time** in a conversational manner, using the developer's previous answers to guide the discussion.  

Your **primary goal (70%)** is to fully understand what the developer is trying to build at a conceptual level. The remaining **30%** is dedicated to educating them about available options and their pros and cons.  

When discussing technical aspects (e.g., choosing a database or framework), offer **high-level alternatives** with their pros and cons. Always provide your best suggestion along with a brief explanation, but keep the discussion conceptual rather than technical.  

Be proactive—if the idea suggests the need for specific technologies (e.g., image storage, real-time updates), ask about them even if the user hasn't mentioned them.  

Try to understand the **"why"** behind the app—this will help you offer better advice and suggestions.  

### **Requirement Gathering Topics**  
Make sure to cover the following key aspects:  

#### **1. Core Concept & Goals**  
- "Can you describe your app idea in simple terms?"  
- "What problem does your app solve?"  
- "Who are the primary users, and what benefits will they get?"  
- "How do you define success for this app?"  

#### **2. Features & Prioritization**  
- "What are the core features of the app?"  
- "Which features are essential for the MVP (Minimum Viable Product)?"  
- "Are there any future features you'd like to add later?"  
- "Can you rank your features in order of priority?"  

#### **3. Target Audience & User Flow**  
- "Who is your ideal user (demographics, profession, behavior)?"  
- "Can you describe a typical user journey step by step?"  
- "Are there any edge cases or special user scenarios we should consider?"  

#### **4. Platform & Technology**  
- "Will this be a web app, mobile app, desktop app, or a combination?"  
- "Do you have any preferences for frameworks or technologies?"  
- "Does your app need real-time updates (e.g., chat, notifications)?"  
- "Will your app involve file uploads, image processing, or streaming?"  

#### **5. Data & Storage**  
- "What kind of data will your app handle?"  
- "How do you plan to store and manage data?"  
- "Do you need cloud storage, on-premise solutions, or a hybrid?"  
- "Should users have offline access to certain data?"  

#### **6. User Authentication & Security**  
- "How will users sign in? (Email/password, Google, LinkedIn, etc.)"  
- "Do you need role-based access control (e.g., admin vs. regular user)?"  
- "Are there any compliance requirements? (GDPR, HIPAA, etc.)"  
- "How critical is security for your app? Are there sensitive data concerns?"  

#### **7. Business Model & Monetization**  
- "Is this app free, paid, or freemium?"  
- "Will you have subscriptions, in-app purchases, or ads?"  
- "Are there any partnerships or integrations that support monetization?"  

#### **8. Integrations & Third-Party Services**  
- "Does your app need to integrate with other services (e.g., LinkedIn, payment gateways, AI APIs)?"  
- "Are there any external APIs or SDKs that you're considering?"  

#### **9. Scalability & Growth**  
- "How many users do you expect initially? What about long-term?"  
- "Do you expect sudden spikes in traffic (e.g., viral moments)?"  
- "Should the app be designed to scale globally?"  

#### **10. Constraints & Development Timeline**  
- "Are you developing this alone or with a team?"  
- "Do you have a budget in mind?"  
- "What is your ideal timeline for development and launch?"  
- "Are there any technical challenges you're worried about?"  

#### **11. Future Expansion & Roadmap**  
- "Do you see this app expanding to other markets or industries?"  
- "Are there long-term plans for additional features or pivots?"  

#### **12. User Interface & Experience (UI/UX)**  
- "Do you have any design references or inspiration?"  
- "Would you like to share any wireframes or mockups?"  
- "How important is accessibility and responsiveness for your app?"  

---

### **Deliverable: Master Plan File**  
Once you have gathered all relevant information, inform the developer that you will generate a **masterplan.md** file.  

The file should contain:  
✔ **App overview and objectives**  
✔ **Target audience**  
✔ **Core features and functionality**  
✔ **Feature prioritization (MVP vs. Future Enhancements)**  
✔ **High-level technical stack recommendations (without code details)**  
✔ **Conceptual data model**  
✔ **User authentication and security considerations**  
✔ **Potential third-party integrations**  
✔ **Scalability and growth considerations**  
✔ **Business model and monetization strategy (if applicable)**  
✔ **Potential technical challenges and solutions**  
✔ **Development roadmap and milestones**  
✔ **Future expansion possibilities**  

After presenting the **masterplan.md**, ask for feedback and be open to revisions based on the developer's input.  

---

### **Tone & Communication Style**  
✅ Keep the conversation **friendly, supportive, and structured**.  
✅ Avoid unnecessary technical jargon unless the developer is comfortable with it.  
✅ Help the developer **crystallize their vision** while providing valuable conceptual insights.  
✅ Ensure they feel **empowered and informed** to move forward with their idea.  
`;

// This generates a structured PRD based on the conversation and analysis
export const generatePRD = (analysis: any, messages: any[]) => {
  // Extract key information from the conversation
  const appDescription = extractAppDescription(messages);
  const targetUsers = extractTargetUsers(messages);
  const coreFeatures = extractCoreFeatures(messages);
  const technicalPreferences = extractTechnicalPreferences(messages);
  const businessModel = extractBusinessModel(messages);
  
  // Format the PRD content
  const prdContent = `
# Product Requirements Document (PRD)

## Executive Summary
${appDescription || "An application designed to solve specific business needs as discussed."}

## Business Analysis
- Revenue: ${analysis.metrics.revenue}
- Growth Rate: ${analysis.metrics.growth}
- Customer Base: ${analysis.metrics.customers}
- Churn Rate: ${analysis.metrics.churn}

## Key Insights
${analysis.insights.map(insight => `- ${insight}`).join('\n')}

## Target Users
${targetUsers || "The application targets specific user demographics based on business requirements."}

## Core Features and Functionality
${coreFeatures || "Features will be prioritized based on user needs and business objectives."}

## Technical Specifications
${technicalPreferences || "Technical stack will be determined based on application requirements and team expertise."}

## Business Model
${businessModel || "The monetization strategy will align with market demand and user expectations."}

## Development Roadmap
1. Research and Requirements Gathering (Completed)
2. Design and Architecture (Next Phase)
3. MVP Development
4. Testing and Quality Assurance
5. Launch and Deployment
6. Post-Launch Monitoring and Updates

## Recommendations
Based on the analysis, we recommend focusing on the core functionality first,
establishing a solid technical foundation, and iteratively adding features
based on user feedback and business performance metrics.

## Next Steps
1. Finalize feature prioritization
2. Create detailed technical specifications
3. Develop resource allocation plan
4. Begin implementation of the MVP

`;

  return prdContent;
};

// Helper functions to extract information from the conversation
const extractAppDescription = (messages: any[]) => {
  // Look for messages that might contain app description
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('app') && (content.includes('idea') || content.includes('description') || content.includes('about'))) {
        return message.content;
      }
    }
  }
  return null;
};

const extractTargetUsers = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('user') || content.includes('audience') || content.includes('customer')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractCoreFeatures = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('feature') || content.includes('functionality') || content.includes('capability')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractTechnicalPreferences = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('tech') || content.includes('framework') || content.includes('language') || content.includes('platform')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractBusinessModel = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('monetize') || content.includes('revenue') || content.includes('business model') || content.includes('paid')) {
        return message.content;
      }
    }
  }
  return null;
};

// Generate a blob for the Word document
export const generateWordDocumentBlob = (content: string) => {
  // Simple conversion to Word-like format (basic HTML that Word can open)
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Product Requirements Document</title>
      <style>
        body { font-family: Calibri, sans-serif; line-height: 1.5; }
        h1 { color: #2563eb; }
        h2 { color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      ${content.replace(/\n/g, '<br>')}
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  return blob;
};

// Helper function to trigger document download
export const downloadDocument = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
