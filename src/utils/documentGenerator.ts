
/**
 * Document Generator Utility
 * Handles the creation and download of the Product Requirements Document
 */

// The refined role-play prompt as provided
export const BUSINESS_ANALYST_PROMPT = `You are a professional CTO who is very friendly and supportive. Your task is to help a developer understand and plan their app idea through a series of questions. Follow these instructions:

Begin by explaining to the developer that you'll be asking them a series of questions to understand their app idea at a high level, and that once you have a clear picture, you'll generate a comprehensive requirements.md file as a blueprint for their application.

Ask questions one at a time in a conversational manner. Use the developer's previous answers to inform your next questions.

Your primary goal (70% of your focus) is to fully understand what the user is trying to build at a conceptual level. The remaining 30% is dedicated to educating the user about available options and their associated pros and cons.

When discussing technical aspects (e.g., choosing a database or framework), offer high-level alternatives with pros and cons for each approach. Always provide your best suggestion along with a brief explanation of why you recommend it, but keep the discussion conceptual rather than technical.

Be proactive in your questioning. If the user's idea seems to require certain technologies or services (e.g., image storage, real-time updates), ask about these even if the user hasn't mentioned them.

Try to understand the 'why' behind what the user is building. This will help you offer better advice and suggestions.

Ask if the user has any diagrams or wireframes of the app they would like to share or describe to help you better understand their vision.

Remember that developers may provide unorganized thoughts as they brainstorm. Help them crystallize the goal of their app and their requirements through your questions and summaries.

Cover key aspects of app development in your questions, including but not limited to: • Core features and functionality • Target audience • Platform (web, mobile, desktop) • User interface and experience concepts • Data storage and management needs • User authentication and security requirements • Potential third-party integrations •Scalability considerations • Potential technical challenges

After you feel you have a comprehensive understanding of the app idea, inform the user that you'll be generating a requirements.md file.

Generate the requirements.md file. This should be a blueprint of the app detailing each of the input received , including: • App overview and objectives • Target audience • Core features and functionality • High-level technical stack recommendations (without specific code or implementation details) • Conceptual data model • User interface design principles • Security considerations • Development phases or milestones • Potential challenges and solutions • Future expansion possibilities

Present the requirements.md to the user and ask for their feedback. Be open to making adjustments based on their input.

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
  const uiux = extractUiUx(messages);
  
  // Format the PRD content following the structure
  const prdContent = `
# Product Requirements Document (PRD) / Requirements

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
${futureExpansion ? `${futureExpansion}` : `
- Advanced analytics and reporting
- Enhanced user experience elements
- Integration with additional third-party services
- Performance optimizations and scalability improvements`}

## Technical Recommendations
${technicalPreferences ? `${technicalPreferences}` : `
The recommended technical stack will depend on application requirements, but may include:
- Frontend: React with TypeScript for robust UI development
- Styling: Tailwind CSS for rapid UI implementation
- State Management: Context API or Redux depending on complexity
- Backend: Node.js with Express or Next.js API routes
- Database: SQL or NoSQL based on data structure requirements`}

## Conceptual Data Model
- User data: Profile information, preferences, authentication details
- Application data: Core business objects and their relationships
- Transactional data: Records of user actions and system events
- Configuration data: System settings and parameters

## User Interface & Experience (UI/UX)
${uiux ? `${uiux}` : `
- Clean, intuitive interface with focus on usability
- Responsive design for all device sizes
- Accessibility compliance (WCAG standards)
- Consistent visual language throughout the application`}

## User Authentication and Security
${securityConsiderations ? `${securityConsiderations}` : `
Security will be implemented with industry best practices, including:
- Secure authentication with email/password or social login options
- Role-based access control for different user types
- Data encryption for sensitive information
- Regular security audits and vulnerability testing`}

## Integrations
${integrations ? `${integrations}` : `
Based on requirements, the following integrations may be considered:
- Payment processing (Stripe, PayPal)
- Email services (SendGrid, Mailchimp)
- Analytics (Google Analytics, Mixpanel)
- Cloud storage (AWS S3, Google Cloud Storage)`}

## Scalability Considerations
${scalability ? `${scalability}` : `
The application architecture will be designed with scalability in mind:
- Horizontal scaling for handling increased user load
- Caching strategies for improved performance
- Database optimization for larger data volumes
- CDN implementation for global content delivery`}

## Business Model
${businessModel || "The monetization strategy will align with market demand and user expectations."}

## Technical Challenges and Solutions
${challenges ? `${challenges}` : `
Anticipated challenges include:
- Real-time data synchronization: Will be addressed using WebSockets or similar technology
- Mobile responsiveness: Solved with responsive design principles and thorough testing
- Data migration: Handled through careful planning and incremental implementation
- Performance optimization: Addressed through code splitting and lazy loading`}

## Development Roadmap
${roadmap ? `${roadmap}` : `
The development process will follow these phases:
1. Research and Requirements Gathering (Completed)
2. Design and Architecture (2-3 weeks)
3. MVP Development (4-6 weeks)
4. Testing and Quality Assurance (2 weeks)
5. Beta Launch and Feedback Collection (2 weeks)
6. Refinement and Official Launch (2 weeks)
7. Post-Launch Monitoring and Updates (Ongoing)`}

---

We value your feedback on this requirements document and are open to revisions based on your input. Please review and let us know if there are any aspects you'd like to adjust or explore further.
`;

  return prdContent;
};

// This generates a detailed development roadmap with task-level breakdown
export const generateDetailedRoadmap = (analysis: any, messages: any[]) => {
  // Extract basic info about the project from the conversation
  const appDescription = extractAppDescription(messages);
  const coreFeatures = extractCoreFeatures(messages);
  const technicalPreferences = extractTechnicalPreferences(messages);
  
  // Generate the detailed roadmap content
  const roadmapContent = `
# Detailed Development Roadmap

## Project: ${appDescription ? appDescription.split('.')[0] : "App Development Plan"}

This document provides a comprehensive task-level breakdown of the development process, including estimated effort and dependencies for each phase.

---

## Phase 1: Research and Requirements Gathering (2 weeks)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 1.1 | Stakeholder interviews | 2-3 days | None |
| 1.2 | Market research | 2-3 days | None |
| 1.3 | Competitive analysis | 2 days | Task 1.2 |
| 1.4 | User persona development | 1-2 days | Task 1.1 |
| 1.5 | Initial requirements documentation | 2-3 days | Tasks 1.1-1.4 |
| 1.6 | Requirements review with stakeholders | 1 day | Task 1.5 |
| 1.7 | Requirement finalization | 1 day | Task 1.6 |

### Deliverables:
- Comprehensive requirements document
- User personas
- Market analysis report
- Initial feature prioritization

---

## Phase 2: Design and Architecture (3 weeks)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 2.1 | Technical stack selection | 2 days | Phase 1 |
| 2.2 | System architecture design | 3-4 days | Task 2.1 |
| 2.3 | Database schema design | 2-3 days | Task 2.2 |
| 2.4 | API endpoint planning | 2 days | Task 2.2 |
| 2.5 | UI/UX wireframing | 3-4 days | Phase 1 |
| 2.6 | UI mockup creation | 3-4 days | Task 2.5 |
| 2.7 | Design system setup | 2 days | Task 2.6 |
| 2.8 | Architecture and design review | 1-2 days | Tasks 2.1-2.7 |

### Deliverables:
- System architecture document
- Database schema diagrams
- API specifications
- UI/UX wireframes and mockups
- Design system

---

## Phase 3: MVP Development (6 weeks)

### Tasks:
#### Backend Development (3 weeks)
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 3.1 | Project setup and configuration | 1 day | Phase 2 |
| 3.2 | Database implementation | 2-3 days | Task 3.1 |
| 3.3 | User authentication system | 3-4 days | Task 3.2 |
| 3.4 | Core API development - Part 1 | 3-4 days | Task 3.3 |
| 3.5 | Core API development - Part 2 | 3-4 days | Task 3.4 |
| 3.6 | API testing and documentation | 2-3 days | Tasks 3.4, 3.5 |

#### Frontend Development (3 weeks)
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 3.7 | Frontend project setup | 1 day | Phase 2 |
| 3.8 | Component library implementation | 2-3 days | Task 3.7 |
| 3.9 | User authentication UI | 2-3 days | Task 3.8 |
| 3.10 | Core feature implementation - Part 1 | 3-4 days | Task 3.9 |
| 3.11 | Core feature implementation - Part 2 | 3-4 days | Task 3.10 |
| 3.12 | Responsive design implementation | 2-3 days | Tasks 3.10, 3.11 |

### Deliverables:
- Functional MVP with core features
- API documentation
- Initial user documentation

---

## Phase 4: Testing and Quality Assurance (2 weeks)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 4.1 | Test plan development | 1-2 days | Phase 3 |
| 4.2 | Unit testing | 2-3 days | Phase 3 |
| 4.3 | Integration testing | 2-3 days | Task 4.2 |
| 4.4 | User acceptance testing setup | 1 day | Task 4.1 |
| 4.5 | User acceptance testing execution | 2-3 days | Task 4.4 |
| 4.6 | Bug fixing and refinements | 3-4 days | Tasks 4.2-4.5 |
| 4.7 | Performance testing | 1-2 days | Task 4.6 |

### Deliverables:
- Comprehensive test documentation
- Quality assurance report
- Refined application ready for beta

---

## Phase 5: Beta Launch and Feedback Collection (2 weeks)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 5.1 | Beta deployment planning | 1 day | Phase 4 |
| 5.2 | Beta environment setup | 1-2 days | Task 5.1 |
| 5.3 | Beta user onboarding | 1 day | Task 5.2 |
| 5.4 | Monitoring system setup | 1 day | Task 5.2 |
| 5.5 | Feedback collection system setup | 1 day | Task 5.2 |
| 5.6 | Beta period active monitoring | 5-7 days | Tasks 5.3-5.5 |
| 5.7 | Feedback analysis | 1-2 days | Task 5.6 |

### Deliverables:
- Beta version of the application
- Feedback collection and analysis report
- Prioritized improvements list

---

## Phase 6: Refinement and Official Launch (2 weeks)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 6.1 | High-priority improvements implementation | 3-5 days | Phase 5 |
| 6.2 | Final quality assurance | 2-3 days | Task 6.1 |
| 6.3 | Production deployment planning | 1 day | Task 6.2 |
| 6.4 | User documentation finalization | 1-2 days | Task 6.1 |
| 6.5 | Marketing materials preparation | 2-3 days | Phase 5 |
| 6.6 | Production deployment | 1 day | Tasks 6.3, 6.4 |
| 6.7 | Launch announcement | 1 day | Task 6.6 |

### Deliverables:
- Production-ready application
- Complete user documentation
- Marketing materials
- Official launch

---

## Phase 7: Post-Launch Monitoring and Updates (Ongoing)

### Tasks:
| Task | Description | Estimated Effort | Dependencies |
|------|-------------|------------------|--------------|
| 7.1 | Monitoring system refinement | 1-2 days | Phase 6 |
| 7.2 | Bug tracking and fixing | Ongoing | Phase 6 |
| 7.3 | User feedback collection and analysis | Ongoing | Phase 6 |
| 7.4 | Performance optimization | 3-5 days (every 2-3 months) | Task 7.2 |
| 7.5 | Security audits | 2-3 days (quarterly) | Phase 6 |
| 7.6 | Feature updates planning | 5 days (quarterly) | Tasks 7.2, 7.3 |
| 7.7 | Feature implementation | Varies by feature | Task 7.6 |

### Deliverables:
- Regular performance reports
- Security audit reports
- New feature releases
- Maintenance updates

---

## Risk Assessment and Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|------------|---------------------|
| Technical challenges with integrations | Medium | Medium | Early proof-of-concept testing, alternative solutions identified |
| Timeline delays | High | Medium | Buffer time included in estimates, clear prioritization of features |
| Resource constraints | Medium | Low | Flexible resource allocation, clear documentation for onboarding |
| Scope creep | High | High | Rigorous change management process, clear MVP definition |
| User adoption challenges | High | Medium | Early user involvement, comprehensive onboarding, focus on UX |

---

## Resource Planning

### Development Team:
- 1 Project Manager
- 1 Backend Developer
- 1 Frontend Developer
- 1 UI/UX Designer
- 1 QA Engineer (part-time)

### Additional Resources:
- DevOps support for deployment and infrastructure
- Marketing support for launch
- Customer support training for post-launch

---

This detailed roadmap provides a comprehensive breakdown of the development process. While estimates and specific tasks may need adjustment as the project progresses, this framework establishes clear expectations, dependencies, and deliverables for each phase of development.
`;

  return roadmapContent;
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

// New extraction function for UI/UX information
const extractUiUx = (messages: any[]) => {
  for (const message of messages) {
    if (message.sender === 'user') {
      const content = message.content.toLowerCase();
      if (content.includes('ui') || content.includes('ux') || content.includes('interface') || content.includes('experience') || content.includes('design')) {
        return message.content;
      }
    }
  }
  return null;
};
