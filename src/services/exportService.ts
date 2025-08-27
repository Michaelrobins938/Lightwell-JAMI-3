// Chat export service for multiple formats

import { 
  ExportOptions, 
  ExportedChat, 
  ExportedMessage, 
  ExportedBranch,
  ExportProgress,
  ExportResult 
} from '../types/export.types';
import { ChatMessage } from '../hooks/useStreamingChat';
import { ThreadTree } from '../types/thread.types';

export class ExportService {
  private static instance: ExportService;
  
  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  // Main export method
  async exportChat(
    messages: ChatMessage[],
    threadTree?: ThreadTree,
    options: ExportOptions = this.getDefaultOptions(),
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    try {
      onProgress?.({
        stage: 'preparing',
        progress: 0,
        currentStep: 'Analyzing chat data'
      });

      // Prepare export data
      const exportData = await this.prepareExportData(messages, options, threadTree);
      
      onProgress?.({
        stage: 'processing',
        progress: 25,
        currentStep: 'Processing messages'
      });

      // Generate content based on format
      let result: ExportResult;
      
      switch (options.format) {
        case 'json':
          result = await this.exportToJSON(exportData, options, onProgress);
          break;
        case 'markdown':
          result = await this.exportToMarkdown(exportData, options, onProgress);
          break;
        case 'pdf':
          result = await this.exportToPDF(exportData, options, onProgress);
          break;
        case 'html':
          result = await this.exportToHTML(exportData, options, onProgress);
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      onProgress?.({
        stage: 'complete',
        progress: 100,
        currentStep: 'Export completed'
      });

      return result;

    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown export error'
      };
    }
  }

  // Prepare data for export
  private async prepareExportData(
    messages: ChatMessage[],
    options: ExportOptions,
    threadTree?: ThreadTree
  ): Promise<ExportedChat> {
    // Filter messages based on options
    let filteredMessages = this.filterMessages(messages, options);

    // Convert to export format
    const exportedMessages: ExportedMessage[] = filteredMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: {
        tokens: this.estimateTokens(msg.content),
        feedback: undefined, // TODO: Get from feedback store
        edited: false, // TODO: Get from message metadata
      }
    }));

    // Process branches if available
    const exportedBranches: ExportedBranch[] = [];
    if (threadTree && options.includeBranches) {
      threadTree.branches.forEach(branch => {
        exportedBranches.push({
          id: branch.id,
          name: branch.name || 'Unnamed Branch',
          startMessageId: branch.startNodeId,
          endMessageId: branch.endNodeId,
          createdAt: branch.createdAt,
          reason: 'manual', // TODO: Get from branch metadata
          messageIds: [] // TODO: Extract message IDs from branch path
        });
      });
    }

    // Generate metadata
    const metadata = {
      messageCount: exportedMessages.length,
      branchCount: exportedBranches.length,
      conversationLength: this.calculateConversationLength(exportedMessages),
      participants: Array.from(new Set(exportedMessages.map(m => m.role))),
      topics: await this.extractTopics(exportedMessages),
      summary: await this.generateSummary(exportedMessages)
    };

    return {
      id: `export_${Date.now()}`,
      title: this.generateTitle(exportedMessages),
      userId: 'current-user', // TODO: Get from context
      exportedAt: new Date(),
      exportFormat: options.format,
      metadata,
      messages: exportedMessages,
      branches: options.includeBranches ? exportedBranches : undefined,
      settings: {
        model: 'gpt-4o-mini',
        // TODO: Get actual settings
      }
    };
  }

  // Export to JSON format
  private async exportToJSON(
    data: ExportedChat,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    onProgress?.({
      stage: 'formatting',
      progress: 50,
      currentStep: 'Formatting JSON'
    });

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const filename = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;

    onProgress?.({
      stage: 'generating',
      progress: 90,
      currentStep: 'Creating download'
    });

    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      downloadUrl,
      filename,
      fileSize: blob.size
    };
  }

  // Export to Markdown format
  private async exportToMarkdown(
    data: ExportedChat,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    onProgress?.({
      stage: 'formatting',
      progress: 50,
      currentStep: 'Formatting Markdown'
    });

    let markdown = this.generateMarkdownHeader(data, options);
    
    onProgress?.({
      stage: 'formatting',
      progress: 60,
      currentStep: 'Processing messages'
    });

    // Add messages
    data.messages.forEach(message => {
      markdown += this.formatMessageAsMarkdown(message, options);
    });

    // Add branches section if included
    if (options.includeBranches && data.branches && data.branches.length > 0) {
      markdown += '\n\n## Conversation Branches\n\n';
      data.branches.forEach(branch => {
        markdown += `### ${branch.name}\n`;
        markdown += `- **Created**: ${branch.createdAt.toLocaleString()}\n`;
        markdown += `- **Reason**: ${branch.reason}\n`;
        markdown += `- **Messages**: ${branch.messageIds.length}\n\n`;
      });
    }

    // Add metadata footer
    if (options.includeMetadata) {
      markdown += this.generateMarkdownFooter(data);
    }

    onProgress?.({
      stage: 'generating',
      progress: 90,
      currentStep: 'Creating download'
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const filename = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.md`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      downloadUrl,
      filename,
      fileSize: blob.size
    };
  }

  // Export to PDF format (using HTML to PDF conversion)
  private async exportToPDF(
    data: ExportedChat,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    onProgress?.({
      stage: 'formatting',
      progress: 50,
      currentStep: 'Generating PDF content'
    });

    // First generate HTML
    const htmlContent = await this.generateHTML(data, options, true);

    onProgress?.({
      stage: 'generating',
      progress: 70,
      currentStep: 'Converting to PDF'
    });

    try {
      // Use browser's print functionality to generate PDF
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // For a real implementation, you'd use a library like jsPDF or Puppeteer
      // This is a simplified version
      onProgress?.({
        stage: 'generating',
        progress: 90,
        currentStep: 'Preparing download'
      });

      // Return the HTML as a fallback since we can't generate real PDFs in browser
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const filename = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.html`;
      const downloadUrl = URL.createObjectURL(blob);

      return {
        success: true,
        downloadUrl,
        filename,
        fileSize: blob.size,
        warnings: ['PDF generation not fully supported in browser. Downloaded as HTML instead.']
      };

    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export to HTML format
  private async exportToHTML(
    data: ExportedChat,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<ExportResult> {
    onProgress?.({
      stage: 'formatting',
      progress: 50,
      currentStep: 'Generating HTML'
    });

    const htmlContent = await this.generateHTML(data, options);

    onProgress?.({
      stage: 'generating',
      progress: 90,
      currentStep: 'Creating download'
    });

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const filename = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.html`;
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      downloadUrl,
      filename,
      fileSize: blob.size
    };
  }

  // Helper methods
  private filterMessages(messages: ChatMessage[], options: ExportOptions): ChatMessage[] {
    let filtered = [...messages];

    // Filter by role
    if (options.filterByRole && options.filterByRole.length > 0) {
      filtered = filtered.filter(msg => options.filterByRole!.includes(msg.role));
    }

    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter(msg => 
        msg.timestamp >= options.dateRange!.start && 
        msg.timestamp <= options.dateRange!.end
      );
    }

    // Filter system messages
    if (!options.includeSystemMessages) {
      filtered = filtered.filter(msg => msg.role !== 'system');
    }

    return filtered;
  }

  private generateMarkdownHeader(data: ExportedChat, options: ExportOptions): string {
    let header = `# ${data.title}\n\n`;
    
    if (options.includeMetadata) {
      header += `**Exported on**: ${data.exportedAt.toLocaleString()}\n`;
      header += `**Messages**: ${data.metadata.messageCount}\n`;
      if (data.metadata.branchCount > 0) {
        header += `**Branches**: ${data.metadata.branchCount}\n`;
      }
      header += `**Duration**: ${data.metadata.conversationLength} minutes\n\n`;
      
      if (data.metadata.summary) {
        header += `## Summary\n\n${data.metadata.summary}\n\n`;
      }
    }

    header += '## Conversation\n\n';
    return header;
  }

  private formatMessageAsMarkdown(message: ExportedMessage, options: ExportOptions): string {
    const role = message.role === 'user' ? '👤 **You**' : '🤖 **Assistant**';
    const timestamp = options.includeTimestamps ? ` *(${message.timestamp.toLocaleTimeString()})*` : '';
    
    let content = `### ${role}${timestamp}\n\n`;
    content += `${message.content}\n\n`;
    
    if (options.includeMetadata && message.metadata) {
      const meta: string[] = [];
      if (message.metadata.tokens) meta.push(`Tokens: ${message.metadata.tokens}`);
      if (message.metadata.model) meta.push(`Model: ${message.metadata.model}`);
      if (message.metadata.feedback) meta.push(`Feedback: ${message.metadata.feedback}`);
      
      if (meta.length > 0) {
        content += `*${meta.join(' • ')}*\n\n`;
      }
    }

    content += '---\n\n';
    return content;
  }

  private generateMarkdownFooter(data: ExportedChat): string {
    let footer = '\n\n## Export Information\n\n';
    footer += `- **Export Format**: ${data.exportFormat.toUpperCase()}\n`;
    footer += `- **Export Date**: ${data.exportedAt.toLocaleString()}\n`;
    footer += `- **Total Messages**: ${data.metadata.messageCount}\n`;
    footer += `- **Conversation Length**: ${data.metadata.conversationLength} minutes\n`;
    
    if (data.metadata.topics && data.metadata.topics.length > 0) {
      footer += `- **Topics**: ${data.metadata.topics.join(', ')}\n`;
    }

    footer += '\n*Generated by Luna AI Chat Export*\n';
    return footer;
  }

  private async generateHTML(data: ExportedChat, options: ExportOptions, forPrint: boolean = false): Promise<string> {
    const styles = this.getHTMLStyles(forPrint);
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    ${styles}
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.title}</h1>
            ${options.includeMetadata ? this.generateHTMLMetadata(data) : ''}
        </header>
        <main>
    `;

    // Add messages
    data.messages.forEach(message => {
      html += this.formatMessageAsHTML(message, options);
    });

    html += `
        </main>
        ${options.includeMetadata ? this.generateHTMLFooter(data) : ''}
    </div>
</body>
</html>`;

    return html;
  }

  private formatMessageAsHTML(message: ExportedMessage, options: ExportOptions): string {
    const roleClass = message.role === 'user' ? 'user-message' : 'assistant-message';
    const roleIcon = message.role === 'user' ? '👤' : '🤖';
    const roleName = message.role === 'user' ? 'You' : 'Assistant';
    const timestamp = options.includeTimestamps ? 
      `<span class="timestamp">${message.timestamp.toLocaleTimeString()}</span>` : '';
    
    let content = `
    <div class="message ${roleClass}">
        <div class="message-header">
            <span class="role">${roleIcon} ${roleName}</span>
            ${timestamp}
        </div>
        <div class="message-content">
            ${this.formatContentForHTML(message.content)}
        </div>
    `;

    if (options.includeMetadata && message.metadata) {
      content += `<div class="message-metadata">`;
      if (message.metadata.tokens) content += `<span>Tokens: ${message.metadata.tokens}</span>`;
      if (message.metadata.model) content += `<span>Model: ${message.metadata.model}</span>`;
      content += `</div>`;
    }

    content += `</div>`;
    return content;
  }

  private formatContentForHTML(content: string): string {
    // Basic markdown to HTML conversion
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  private generateHTMLMetadata(data: ExportedChat): string {
    return `
    <div class="metadata">
        <p><strong>Exported:</strong> ${data.exportedAt.toLocaleString()}</p>
        <p><strong>Messages:</strong> ${data.metadata.messageCount}</p>
        <p><strong>Duration:</strong> ${data.metadata.conversationLength} minutes</p>
        ${data.metadata.branchCount > 0 ? `<p><strong>Branches:</strong> ${data.metadata.branchCount}</p>` : ''}
    </div>`;
  }

  private generateHTMLFooter(data: ExportedChat): string {
    return `
    <footer>
        <p>Generated by Luna AI Chat Export • ${data.exportedAt.toLocaleDateString()}</p>
    </footer>`;
  }

  private getHTMLStyles(forPrint: boolean): string {
    return `
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6; 
            color: #333; 
            background: ${forPrint ? '#fff' : '#f9fafb'};
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: ${forPrint ? '20px' : '40px 20px'};
        }
        header { 
            margin-bottom: 40px; 
            padding-bottom: 20px; 
            border-bottom: 2px solid #e5e7eb;
        }
        h1 { 
            font-size: 2.5rem; 
            font-weight: 700; 
            color: #1f2937; 
            margin-bottom: 10px;
        }
        .metadata { 
            color: #6b7280; 
            font-size: 0.9rem;
        }
        .metadata p { margin: 4px 0; }
        .message { 
            margin: 20px 0; 
            padding: 20px; 
            border-radius: 12px; 
            border: 1px solid #e5e7eb;
        }
        .user-message { 
            background: #dbeafe; 
            border-left: 4px solid #3b82f6;
        }
        .assistant-message { 
            background: #f3f4f6; 
            border-left: 4px solid #6b7280;
        }
        .message-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 12px;
        }
        .role { 
            font-weight: 600; 
            font-size: 1.1rem;
        }
        .timestamp { 
            color: #6b7280; 
            font-size: 0.85rem;
        }
        .message-content { 
            font-size: 1rem; 
            line-height: 1.7;
        }
        .message-metadata { 
            margin-top: 12px; 
            padding-top: 12px; 
            border-top: 1px solid #e5e7eb; 
            font-size: 0.8rem; 
            color: #6b7280;
        }
        .message-metadata span { 
            margin-right: 15px;
        }
        code { 
            background: #f1f5f9; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-size: 0.9em;
        }
        footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            color: #6b7280; 
            font-size: 0.9rem;
        }
        ${forPrint ? `
        @media print {
            body { background: white; }
            .container { padding: 0; }
            .message { break-inside: avoid; }
        }` : ''}
    </style>`;
  }

  // Utility methods
  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  private calculateConversationLength(messages: ExportedMessage[]): number {
    if (messages.length < 2) return 0;
    
    const start = messages[0].timestamp;
    const end = messages[messages.length - 1].timestamp;
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  private async extractTopics(messages: ExportedMessage[]): Promise<string[]> {
    // Simple keyword extraction - in production, use NLP
    const text = messages.map(m => m.content).join(' ').toLowerCase();
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall']);
    
    const words = text.match(/\b\w{4,}\b/g) || [];
    const wordCount = (words as string[]).reduce((acc: Record<string, number>, word: string) => {
      if (!commonWords.has(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => Number(b) - Number(a))
      .slice(0, 5)
      .map(([word]) => word);
  }

  private async generateSummary(messages: ExportedMessage[]): Promise<string> {
    // Simple summary - in production, use AI summarization
    if (messages.length === 0) return 'No messages to summarize';
    
    const messageCount = messages.length;
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    
    return `Conversation with ${messageCount} messages (${userMessages} from user, ${assistantMessages} from assistant).`;
  }

  private generateTitle(messages: ExportedMessage[]): string {
    if (messages.length === 0) return 'Empty Conversation';
    
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 50);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }
    
    return `Conversation ${new Date().toLocaleDateString()}`;
  }

  private getDefaultOptions(): ExportOptions {
    return {
      format: 'markdown',
      includeMetadata: true,
      includeTimestamps: true,
      includeBranches: false,
      includeSystemMessages: false,
      compressionLevel: 'minimal'
    };
  }
}