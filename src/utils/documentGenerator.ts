
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
}

export const generatePRD = (analysis: any, conversationHistory: any[]): PRDContent => {
  // Extract key information from the analysis and conversation
  const insights = analysis?.insights || [];
  const metrics = analysis?.metrics || {};
  
  // Generate recommendations based on insights
  const recommendations = insights.map(insight => 
    `Consider ${insight.toLowerCase().includes('increase') || insight.toLowerCase().includes('growing') ? 
      'capitalizing on' : 'addressing'} the ${insight.toLowerCase().replace('is ', '')}`
  );
  
  // Get overview from the conversation (use the last agent message as summary)
  const agentMessages = conversationHistory.filter(m => m.sender === 'agent');
  const overview = agentMessages.length > 1 ? 
    agentMessages[agentMessages.length - 1].content : 
    "Based on the business data analysis, we've identified several key areas for improvement.";

  return {
    title: "Product Requirements Document",
    date: new Date().toLocaleDateString(),
    overview,
    requirements: insights,
    metrics,
    recommendations: recommendations.length ? recommendations : ["Implement data-driven decision making process", "Review customer feedback for product improvements", "Optimize resource allocation based on performance metrics"]
  };
};

export const generateWordDocumentBlob = (prdContent: PRDContent): Blob => {
  // Simple HTML template for the document
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${prdContent.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2cm; }
        h1 { color: #0070f3; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 20px; }
        .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        .metric-value { font-weight: bold; color: #0070f3; }
        .date { color: #666; font-style: italic; margin-bottom: 20px; }
        ul { margin: 10px 0; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <h1>${prdContent.title}</h1>
      <p class="date">Generated on ${prdContent.date}</p>
      
      <h2>Executive Summary</h2>
      <p>${prdContent.overview}</p>
      
      <h2>Business Metrics</h2>
      <div class="metrics">
        ${Object.entries(prdContent.metrics).map(([key, value]) => 
          `<div class="metric"><div>${key}</div><div class="metric-value">${value}</div></div>`
        ).join('')}
      </div>
      
      <h2>Key Requirements</h2>
      <ul>
        ${prdContent.requirements.map(req => `<li>${req}</li>`).join('')}
      </ul>
      
      <h2>Recommendations</h2>
      <ul>
        ${prdContent.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
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
