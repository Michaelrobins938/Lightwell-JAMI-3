declare module 'node-nlp' {
  export class SentimentAnalyzer {
    constructor(options: { language: string });
    getSentiment(text: string): Promise<any>;
  }
} 