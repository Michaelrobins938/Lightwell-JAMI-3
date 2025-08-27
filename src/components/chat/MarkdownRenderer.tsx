"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy } from "lucide-react";
import dynamic from "next/dynamic";

const CanvasRenderer = dynamic(() => import("./CanvasRenderer"), { ssr: false });
const ReactBlockRenderer = dynamic(() => import("./ReactBlockRenderer"), { ssr: false });
const FileBlock = dynamic(() => import("./FileBlock"), { ssr: false });

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-200 prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const language = className?.replace("language-", "");
          const code = String(children).trim();
          const [copied, setCopied] = useState(false);

          if (inline) {
            return (
              <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-300">
                {children}
              </code>
            );
          }

          // Canvas blocks - render live canvas
          if (language === "canvas") {
            return (
              <div className="my-4 border border-gray-700 rounded-lg overflow-hidden">
                <CanvasRenderer content={code} />
              </div>
            );
          }

          // React blocks - render live React components
          if (language === "react") {
            return (
              <div className="my-4 border border-gray-700 rounded-lg overflow-hidden p-4 bg-gray-800/50">
                <ReactBlockRenderer code={code} />
              </div>
            );
          }

          // Standard code blocks
          return (
            <div className="relative group">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(String(children));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-2 right-2 hidden group-hover:block bg-gray-700 text-white px-2 py-1 rounded text-xs transition-all duration-200 hover:bg-gray-600"
              >
                {copied ? "Copied!" : <Copy className="w-4 h-4" />}
              </button>
              <SyntaxHighlighter
                style={oneDark}
                language={language || "bash"}
                PreTag="div"
                className="rounded-md text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700 rounded-lg">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="px-4 py-2 bg-gray-800 text-left text-sm font-medium text-gray-200 border-b border-gray-700">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
              {children}
            </td>
          );
        },
        a({ href, children }) {
          return (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-400 transition-colors duration-200"
            >
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-blue-500 bg-gray-800/50 py-2 px-4 rounded-r-lg my-4">
              {children}
            </blockquote>
          );
        },
        hr() {
          return <hr className="border-gray-700 my-6" />;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside space-y-1 my-4 text-gray-300">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside space-y-1 my-4 text-gray-300">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-gray-300">{children}</li>;
        },
        
        // Render images inline with preview and download
        img({ src, alt }) {
          if (!src) return null;
          return (
            <div className="my-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <img
                src={src}
                alt={alt || "Image"}
                className="rounded-lg shadow-md max-w-full h-auto mx-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  (e.currentTarget.nextElementSibling! as HTMLElement).style.display = 'block';
                }}
              />
              <div className="hidden text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <p>Image failed to load</p>
                <p className="text-sm">{src}</p>
              </div>
              {alt && (
                <p className="text-sm text-gray-400 mt-2 text-center">{alt}</p>
              )}
              <div className="flex justify-center mt-3">
                <a
                  href={src}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Image
                </a>
              </div>
            </div>
          );
        },

        // Render links — detect if file and render as file block
        
      }}
    >
      {content}
    </ReactMarkdown>
  );
}


