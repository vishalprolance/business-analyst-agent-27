
/**
 * Utilities for generating and handling document output
 */

export interface PRDContent {
  title: string;
  date: string;
  overview: string;
  requirements: string[];
  metrics: Record<string, string>;
  recommendations: string[];
  developmentRoadmap?: string[];
  targetAudience?: string;
  businessModel?: string;
  technicalStack?: string[];
}

// The refined role-play prompt for the business analyst
export const BUSINESS_ANALYST_PROMPT = `
You are a professional CTO who is very friendly and supportive. Your task is to help the user understand and plan their app idea through a series of questions.

Begin by explaining that you'll be asking a series of questions to understand their app idea. Once you have a clear picture, you'll help generate a comprehensive Product Requirements Document as a blueprint for their application.

Ask questions one at a time in a conversational manner, using previous answers to guide the discussion.

Your primary goal (70%) is to fully understand what they're trying to build at a conceptual level. The remaining 30% is dedicated to educating them about available options and their pros and cons.

When discussing technical aspects, offer high-level alternatives with their pros and cons. Always provide your best suggestion with a brief explanation, but keep the discussion conceptual.

Be proactive—if the idea suggests the need for specific technologies, ask about them even if the user hasn't mentioned them.

Try to understand the "why" behind the app—this will help you offer better advice.

Cover these key topics:
- Core Concept & Goals (problems solved, primary users, definition of success)
- Features & Prioritization (core features, MVP essentials, future additions)
- Target Audience & User Flow (ideal user, typical journey, edge cases)
- Platform & Technology preferences (web/mobile/desktop, frameworks, real-time needs)
- Data & Storage requirements (data types, storage solutions, offline access)
- User Authentication & Security (sign-in methods, access control, compliance)
- Business Model & Monetization (free/paid/freemium, subscriptions, ads)
- Integrations & Third-Party Services (external APIs, SDKs)
- Scalability & Growth expectations (initial users, traffic patterns, global scale)
- Constraints & Development Timeline (team size, budget, timeline, challenges)
- Future Expansion & Roadmap (market expansion, additional features)
- User Interface & Experience preferences (design references, accessibility)

After gathering information, let the user know you can generate a Product Requirements Document that can be downloaded.
`;

export const generatePRD = (analysis: any, conversationHistory: any[]): PRDContent => {
  // Extract key information from the analysis and conversation
  const insights = analysis?.insights || [];
  const metrics = analysis?.metrics || {};
  
  // Generate recommendations based on insights
  const recommendations = insights.map(insight => 
    `Consider ${insight.toLowerCase().includes('increase') || insight.toLowerCase().includes('growing') ? 
      'capitalizing on' : 'addressing'} the ${insight.toLowerCase().replace('is ', '')}`
  );
  
  // Extract more detailed information from the conversation
  const agentMessages = conversationHistory.filter(m => m.sender === 'agent');
  const userMessages = conversationHistory.filter(m => m.sender === 'user');
  
  // Get overview from the conversation (use the last agent message as summary)
  const overview = agentMessages.length > 1 ? 
    agentMessages[agentMessages.length - 1].content : 
    "Based on the business data analysis, we've identified several key areas for improvement.";
  
  // Extract potential target audience, business model, and technical stack information
  const targetAudience = extractTopicFromConversation(conversationHistory, ["target audience", "ideal user", "demographic"]);
  const businessModel = extractTopicFromConversation(conversationHistory, ["business model", "monetization", "revenue", "pricing"]);
  const technicalStack = extractTechnicalStackFromConversation(conversationHistory);
  
  // Generate development roadmap based on conversation
  const developmentRoadmap = [
    "Phase 1: MVP Development (Core features implementation)",
    "Phase 2: User Testing & Refinement",
    "Phase 3: Feature Expansion & Optimization",
    "Phase 4: Scaling & Market Expansion"
  ];
  
  return {
    title: "Product Requirements Document",
    date: new Date().toLocaleDateString(),
    overview,
    requirements: insights,
    metrics,
    recommendations: recommendations.length ? recommendations : ["Implement data-driven decision making process", "Review customer feedback for product improvements", "Optimize resource allocation based on performance metrics"],
    developmentRoadmap,
    targetAudience,
    businessModel,
    technicalStack
  };
};

/**
 * Helper function to extract topic information from conversation
 */
const extractTopicFromConversation = (conversation: any[], keywords: string[]): string => {
  for (const message of conversation) {
    const content = message.content.toLowerCase();
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        // Extract the sentence containing the keyword
        const sentences = message.content.split(/[.!?]+/);
        for (const sentence of sentences) {
          if (sentence.toLowerCase().includes(keyword)) {
            return sentence.trim();
          }
        }
      }
    }
  }
  return "To be determined based on further requirements gathering";
};

/**
 * Helper function to extract technical stack information from conversation
 */
const extractTechnicalStackFromConversation = (conversation: any[]): string[] => {
  const techKeywords = [
    "React", "Angular", "Vue", "Node.js", "Django", "Flask", "Express", 
    "MongoDB", "PostgreSQL", "MySQL", "Firebase", "AWS", "Azure", 
    "Docker", "Kubernetes", "REST API", "GraphQL", "Swift", "Kotlin",
    "Flutter", "React Native", "Supabase"
  ];
  
  const detectedTech: string[] = [];
  
  for (const message of conversation) {
    const content = message.content;
    for (const tech of techKeywords) {
      if (content.includes(tech) && !detectedTech.includes(tech)) {
        detectedTech.push(tech);
      }
    }
  }
  
  return detectedTech.length > 0 ? detectedTech : ["To be determined based on project requirements"];
};

export const generateWordDocumentBlob = (prdContent: PRDContent): Blob => {
  // Enhanced HTML template for the document with additional sections
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${prdContent.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2cm; line-height: 1.6; }
        h1 { color: #0070f3; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 5px; }
        .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .metric-value { font-weight: bold; color: #0070f3; }
        .date { color: #666; font-style: italic; margin-bottom: 20px; }
        ul { margin: 10px 0; }
        li { margin-bottom: 8px; }
        .section { margin-bottom: 20px; }
        .header-with-line { border-bottom: 2px solid #0070f3; display: inline-block; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>${prdContent.title}</h1>
      <p class="date">Generated on ${prdContent.date}</p>
      
      <div class="section">
        <h2 class="header-with-line">Executive Summary</h2>
        <p>${prdContent.overview}</p>
      </div>
      
      ${prdContent.targetAudience ? `
      <div class="section">
        <h2 class="header-with-line">Target Audience</h2>
        <p>${prdContent.targetAudience}</p>
      </div>
      ` : ''}
      
      <div class="section">
        <h2 class="header-with-line">Business Metrics</h2>
        <div class="metrics">
          ${Object.entries(prdContent.metrics).map(([key, value]) => 
            `<div class="metric"><div>${key}</div><div class="metric-value">${value}</div></div>`
          ).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2 class="header-with-line">Key Requirements</h2>
        <ul>
          ${prdContent.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <h2 class="header-with-line">Recommendations</h2>
        <ul>
          ${prdContent.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      
      ${prdContent.businessModel ? `
      <div class="section">
        <h2 class="header-with-line">Business Model</h2>
        <p>${prdContent.businessModel}</p>
      </div>
      ` : ''}
      
      ${prdContent.technicalStack && prdContent.technicalStack.length > 0 ? `
      <div class="section">
        <h2 class="header-with-line">Recommended Technical Stack</h2>
        <ul>
          ${prdContent.technicalStack.map(tech => `<li>${tech}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${prdContent.developmentRoadmap && prdContent.developmentRoadmap.length > 0 ? `
      <div class="section">
        <h2 class="header-with-line">Development Roadmap</h2>
        <ul>
          ${prdContent.developmentRoadmap.map(phase => `<li>${phase}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </body>
    </html>
  `;

  // Convert HTML to blob for download
  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word' });
  return blob;
};

export const downloadDocument = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
