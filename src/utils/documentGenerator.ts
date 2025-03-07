/**
 * Document Generator Utility
 * Handles the creation and download of the Product Requirements Document
 */

// The refined role-play prompt as provided
export const BUSINESS_ANALYST_PROMPT = `You are a professional CTO who is very friendly and supportive. Your task is to help a developer understand and plan their app idea through a series of questions. Follow these instructions:

Begin by explaining to the developer that you'll be asking them a series of questions to understand their app idea at a high level, and that once you have a clear picture, you'll generate a comprehensive masterplan.md file as a blueprint for their application.

Ask questions one at a time in a conversational manner. Use the developer's previous answers to inform your next questions.

Your primary goal (70% of your focus) is to fully understand what the user is trying to build at a conceptual level. The remaining 30% is dedicated to educating the user about available options and their associated pros and cons.

When discussing technical aspects (e.g., choosing a database or framework), offer high-level alternatives with pros and cons for each approach. Always provide your best suggestion along with a brief explanation of why you recommend it, but keep the discussion conceptual rather than technical.

Be proactive in your questioning. If the user's idea seems to require certain technologies or services (e.g., image storage, real-time updates), ask about these even if the user hasn't mentioned them.

Try to understand the 'why' behind what the user is building. This will help you offer better advice and suggestions.

Ask if the user has any diagrams or wireframes of the app they would like to share or describe to help you better understand their vision.

Remember that developers may provide unorganized thoughts as they brainstorm. Help them crystallize the goal of their app and their requirements through your questions and summaries.

Cover key aspects of app development in your questions, including but not limited to: • Core features and functionality • Target audience • Platform (web, mobile, desktop) • User interface and experience concepts • Data storage and management needs • User authentication and security requirements • Potential third-party integrations •Scalability considerations • Potential technical challenges

After you feel you have a comprehensive understanding of the app idea, inform the user that you'll be generating a masterplan.md file.

Generate the masterplan.md file. This should be a high-level blueprint of the app, including: • App overview and objectives • Target audience • Core features and functionality • High-level technical stack recommendations (without specific code or implementation details) • Conceptual data model • User interface design principles • Security considerations • Development phases or milestones • Potential challenges and solutions • Future expansion possibilities

Present the masterplan.md to the user and ask for their feedback. Be open to making adjustments based on their input.

Important: Do not generate any code during this conversation. The goal is to understand and plan the app at a high level, focusing on concepts and architecture rather than implementation details.

Remember to maintain a friendly, supportive tone throughout the conversation. Speak plainly and clearly, avoiding unnecessary technical jargon unless the developer seems comfortable with it. Your goal is to help the developer refine and solidify their app idea while providing valuable insights and recommendations at a conceptual level.

Begin the conversation by introducing yourself and asking the developer to describe their app idea.`;

// This generates a structured PRD based on the conversation and analysis
export const generatePRD = (analysis: any, messages: any[]) => {
  // Extract key information from the conversation
  const appDescription = extractAppDescription(messages);
  const targetUsers = extractTargetUsers(messages);
  const coreFeatures = extractCoreFeatures(messages);
  const technicalPreferences = extractTechnicalPreferences(messages);
  const businessModel = extractBusinessModel(messages);
  const securityConsiderations = extractSecurityConsiderations(messages);
  const integrations = extractIntegrations(messages);
  const scalability = extractScalability(messages);
  const challenges = extractChallenges(messages);
  const roadmap = extractRoadmap(messages);
  const futureExpansion = extractFutureExpansion(messages);
  
  // Format the PRD content following the master plan structure
  const prdContent = `
# Product Requirements Document (PRD) / Master Plan

## App Overview and Objectives
${appDescription || "This application aims to solve specific business needs as discussed in our requirement gathering sessions."}

## Target Audience
${targetUsers || "The application targets specific user demographics based on business requirements."}

## Core Features and Functionality
${coreFeatures || "The core functionality of the application includes the essential features required to meet user needs."}

## Feature Prioritization (MVP vs. Future Enhancements)
### MVP Features
- Essential user authentication and account management
- Core business logic and primary user flows
- Basic data storage and retrieval functionality
- Minimal viable interface for user interaction

### Future Enhancements
- Advanced analytics and reporting
- Enhanced user experience elements
- Integration with additional third-party services
- Performance optimizations and scalability improvements

## High-Level Technical Stack Recommendations
${technicalPreferences || "The recommended technical stack will depend on application requirements, but may include:"}
- Frontend: React with TypeScript for robust UI development
- Styling: Tailwind CSS for rapid UI implementation
- State Management: Context API or Redux depending on complexity
- Backend: Node.js with Express or Next.js API routes
- Database: SQL or NoSQL based on data structure requirements

## Conceptual Data Model
- User data: Profile information, preferences, authentication details
- Application data: Core business objects and their relationships
- Transactional data: Records of user actions and system events
- Configuration data: System settings and parameters

## User Authentication and Security Considerations
${securityConsiderations || "Security will be implemented with industry best practices, including:"}
- Secure authentication with email/password or social login options
- Role-based access control for different user types
- Data encryption for sensitive information
- Regular security audits and vulnerability testing

## Potential Third-Party Integrations
${integrations || "Based on requirements, the following integrations may be considered:"}
- Payment processing (Stripe, PayPal)
- Email services (SendGrid, Mailchimp)
- Analytics (Google Analytics, Mixpanel)
- Cloud storage (AWS S3, Google Cloud Storage)

## Scalability and Growth Considerations
${scalability || "The application architecture will be designed with scalability in mind:"}
- Horizontal scaling for handling increased user load
- Caching strategies for improved performance
- Database optimization for larger data volumes
- CDN implementation for global content delivery

## Business Model and Monetization Strategy
${businessModel || "The monetization strategy will align with market demand and user expectations."}

## Potential Technical Challenges and Solutions
${challenges || "Anticipated challenges include:"}
- Real-time data synchronization: Will be addressed using WebSockets or similar technology
- Mobile responsiveness: Solved with responsive design principles and thorough testing
- Data migration: Handled through careful planning and incremental implementation
- Performance optimization: Addressed through code splitting and lazy loading

## Development Roadmap and Milestones
${roadmap || "The development process will follow these phases:"}
1. Research and Requirements Gathering (Completed)
2. Design and Architecture (2-3 weeks)
3. MVP Development (4-6 weeks)
4. Testing and Quality Assurance (2 weeks)
5. Beta Launch and Feedback Collection (2 weeks)
6. Refinement and Official Launch (2 weeks)
7. Post-Launch Monitoring and Updates (Ongoing)

## Future Expansion Possibilities
${futureExpansion || "Future opportunities for expansion include:"}
- Additional platform support (mobile apps, desktop applications)
- Geographic expansion to new markets
- New feature sets based on user feedback and market trends
- Enhanced AI/ML capabilities for personalization

---

We value your feedback on this master plan and are open to revisions based on your input. Please review and let us know if there are any aspects you'd like to adjust or explore further.
`;

  return prdContent;
};

// Generate a markdown file blob
export const generateMarkdownBlob = (content: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  return blob;
};

// Generate a blob for the Word document
export const generateWordDocumentBlob = (content: string) => {
  // Simple conversion to Word-like format (basic HTML that Word can open)
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Product Requirements Document / Master Plan</title>
      <style>
        body { font-family: Calibri, sans-serif; line-height: 1.5; }
        h1 { color: #2563eb; }
        h2 { color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        h3 { color: #4b5563; }
        ul { margin-bottom: 15px; }
        li { margin-bottom: 5px; }
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

// Helper functions to extract information from the conversation
const extractAppDescription = (messages: any[]) => {
  // Look for messages that might contain app description
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('app') && (content.includes('idea') || content.includes('description') || content.includes('about') || content.includes('overview') || content.includes('objective'))) {
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
      if (content.includes('user') || content.includes('audience') || content.includes('customer') || content.includes('demographic')) {
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
      if (content.includes('tech') || content.includes('framework') || content.includes('language') || content.includes('platform') || content.includes('stack')) {
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
      if (content.includes('monetize') || content.includes('revenue') || content.includes('business model') || content.includes('paid') || content.includes('subscription')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractSecurityConsiderations = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('security') || content.includes('authentication') || content.includes('login') || content.includes('privacy') || content.includes('encrypt')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractIntegrations = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('integration') || content.includes('third-party') || content.includes('api') || content.includes('service') || content.includes('connect')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractScalability = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('scale') || content.includes('growth') || content.includes('expand') || content.includes('performance') || content.includes('traffic')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractChallenges = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('challenge') || content.includes('problem') || content.includes('issue') || content.includes('concern') || content.includes('worry')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractRoadmap = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('roadmap') || content.includes('timeline') || content.includes('milestone') || content.includes('schedule') || content.includes('phase')) {
        return message.content;
      }
    }
  }
  return null;
};

const extractFutureExpansion = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('future') || content.includes('expansion') || content.includes('next') || content.includes('grow') || content.includes('plan')) {
        return message.content;
      }
    }
  }
  return null;
};
