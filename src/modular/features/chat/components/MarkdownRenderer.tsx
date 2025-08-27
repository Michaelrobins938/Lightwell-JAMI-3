"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export default function MarkdownRenderer({ content, isStreaming }: MarkdownRendererProps) {
  const [processedContent, setProcessedContent] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const processMarkdown = (text: string): JSX.Element[] => {
      if (!text) return [];

      const elements: JSX.Element[] = [];
      const lines = text.split('\n');
      let currentIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const key = `line-${currentIndex++}`;

        // Code blocks
        if (line.startsWith('```')) {
          const language = line.slice(3).trim();
          const codeLines: string[] = [];
          let j = i + 1;
          
          // Find closing ```
          while (j < lines.length && !lines[j].startsWith('```')) {
            codeLines.push(lines[j]);
            j++;
          }
          
          elements.push(
            <CodeBlock
              key={key}
              code={codeLines.join('\n')}
              language={language}
            />
          );
          
          i = j; // Skip processed lines
          continue;
        }

        // Headings
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const text = line.replace(/^#+\s*/, '');
          const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
          
          elements.push(
            <HeadingTag
              key={key}
              className={`font-bold mt-4 mb-2 text-white ${
                level === 1 ? 'text-2xl' :
                level === 2 ? 'text-xl' :
                level === 3 ? 'text-lg' :
                'text-base'
              }`}
            >
              {text}
            </HeadingTag>
          );
          continue;
        }

        // Lists
        if (line.match(/^[\s]*[-*+]\s/)) {
          const listItems: string[] = [line];
          let j = i + 1;
          
          // Collect consecutive list items
          while (j < lines.length && lines[j].match(/^[\s]*[-*+]\s/)) {
            listItems.push(lines[j]);
            j++;
          }
          
          elements.push(
            <ul key={key} className="list-disc list-inside my-2 space-y-1 text-slate-200">
              {listItems.map((item, idx) => (
                <li key={`${key}-item-${idx}`} className="ml-4">
                  {processInlineFormatting(item.replace(/^[\s]*[-*+]\s/, ''))}
                </li>
              ))}
            </ul>
          );
          
          i = j - 1; // Adjust for loop increment
          continue;
        }

        // Numbered lists
        if (line.match(/^[\s]*\d+\.\s/)) {
          const listItems: string[] = [line];
          let j = i + 1;
          
          while (j < lines.length && lines[j].match(/^[\s]*\d+\.\s/)) {
            listItems.push(lines[j]);
            j++;
          }
          
          elements.push(
            <ol key={key} className="list-decimal list-inside my-2 space-y-1 text-slate-200">
              {listItems.map((item, idx) => (
                <li key={`${key}-item-${idx}`} className="ml-4">
                  {processInlineFormatting(item.replace(/^[\s]*\d+\.\s/, ''))}
                </li>
              ))}
            </ol>
          );
          
          i = j - 1;
          continue;
        }

        // Blockquotes
        if (line.startsWith('>')) {
          elements.push(
            <blockquote
              key={key}
              className="border-l-4 border-gpt5-amber-start/50 pl-4 py-2 my-2 bg-gpt5-amber-start/10 backdrop-blur-sm rounded-r text-slate-200"
            >
              {processInlineFormatting(line.replace(/^>\s*/, ''))}
            </blockquote>
          );
          continue;
        }

        // Regular paragraphs
        if (line.trim()) {
          elements.push(
            <p key={key} className="my-2 leading-relaxed text-slate-200">
              {processInlineFormatting(line)}
            </p>
          );
        } else {
          // Empty line
          elements.push(<br key={key} />);
        }
      }

      return elements;
    };

    const processInlineFormatting = (text: string): React.ReactNode => {
      if (!text) return '';

      // Handle inline code
      text = text.replace(/`([^`]+)`/g, '<code class="bg-white/10 border border-white/20 px-1 py-0.5 rounded text-sm font-mono text-gpt5-amber-start">$1</code>');
      
      // Handle bold
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      text = text.replace(/__([^_]+)__/g, '<strong class="text-white font-semibold">$1</strong>');
      
      // Handle italic
      text = text.replace(/\*([^*]+)\*/g, '<em class="text-slate-300 italic">$1</em>');
      text = text.replace(/_([^_]+)_/g, '<em class="text-slate-300 italic">$1</em>');
      
      // Handle links
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-gpt5-pink hover:text-gpt5-purple underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
      
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    setProcessedContent(processMarkdown(content));
  }, [content]);

  return (
    <div className="prose max-w-none text-slate-200">
      {processedContent}
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-gpt5-beam-gradient animate-pulse ml-1 rounded-sm" />
      )}
    </div>
  );
}

// Code block component
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 bg-gpt5-black/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gpt5-slate-800/50 border-b border-white/10">
        <span className="text-sm text-slate-300 font-mono">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code */}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-slate-100 font-mono whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
  );
}