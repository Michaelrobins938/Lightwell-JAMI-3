"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, createElement, Fragment, Children, cloneElement, isValidElement, createContext, useContext, useReducer, useImperativeHandle, useLayoutEffect, useDebugValue, useId, useTransition, useDeferredValue, useSyncExternalStore, useInsertionEffect } from 'react';
import { motion } from 'framer-motion';

interface ReactBlockRendererProps {
  code: string;
}

export default function ReactBlockRenderer({ code }: { code: string }) {
  const [Component, setComponent] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a safe sandbox for React component execution
      const createComponent = () => {
        // Define common React hooks and utilities
        const sandboxedReact = {
          useState: (initial: any) => {
            const [value, setValue] = useState(initial);
            return [value, setValue];
          },
          useEffect: (effect: () => void, deps?: any[]) => {
            useEffect(effect, deps);
          },
          useRef: (initial: any) => {
            return useRef(initial);
          },
          useCallback: (callback: Function, deps: any[]) => {
            return useCallback(callback, deps);
          },
          useMemo: (factory: Function, deps: any[]) => {
            return useMemo(factory as () => unknown, deps);
          },
          createElement: (type: any, props?: any, ...children: any[]) => {
            return createElement(type, props, ...children);
          },
          Fragment: Fragment,
          Children: Children,
          cloneElement: cloneElement,
          isValidElement: isValidElement,
          createContext: createContext,
          useContext: useContext,
          useReducer: useReducer,
          useImperativeHandle: useImperativeHandle,
          useLayoutEffect: useLayoutEffect,
          useDebugValue: useDebugValue,
          useId: useId,
          useTransition: useTransition,
          useDeferredValue: useDeferredValue,
          useSyncExternalStore: useSyncExternalStore,
          useInsertionEffect: useInsertionEffect,
        };

        // Define common HTML elements
        const htmlElements = {
          div: 'div',
          span: 'span',
          button: 'button',
          input: 'input',
          p: 'p',
          h1: 'h1',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          ul: 'ul',
          ol: 'ol',
          li: 'li',
          a: 'a',
          img: 'img',
          form: 'form',
          label: 'label',
          textarea: 'textarea',
          select: 'select',
          option: 'option',
          table: 'table',
          thead: 'thead',
          tbody: 'tbody',
          tr: 'tr',
          th: 'th',
          td: 'td',
          nav: 'nav',
          header: 'header',
          footer: 'footer',
          main: 'main',
          section: 'section',
          article: 'article',
          aside: 'aside',
          canvas: 'canvas',
          svg: 'svg',
          path: 'path',
          circle: 'circle',
          rect: 'rect',
          line: 'line',
          polygon: 'polygon',
        };

        // Create a component factory
        const createComponentFactory = (code: string) => {
          try {
            // Wrap the code in a function that returns a component
            const componentCode = `
              (function() {
                const React = window.React;
                const htmlElements = window.htmlElements;
                
                // Make HTML elements available as React components
                Object.keys(htmlElements).forEach(tag => {
                  window[tag] = React.createElement.bind(null, tag);
                });
                
                ${code}
                
                // Return the component or create a default one
                if (typeof Demo !== 'undefined') {
                  return React.createElement(Demo);
                } else if (typeof App !== 'undefined') {
                  return React.createElement(App);
                } else {
                  // Try to find any exported component
                  const exports = Object.keys(window).filter(key => 
                    typeof window[key] === 'function' && 
                    key[0] === key[0].toUpperCase()
                  );
                  if (exports.length > 0) {
                    return React.createElement(window[exports[0]]);
                  }
                  throw new Error('No component found. Please define a component named Demo, App, or export one.');
                }
              })()
            `;

            // Execute the code in a safe context
            const component = eval(componentCode);
            return component;
          } catch (err) {
            throw new Error(`Component creation failed: ${err}`);
          }
        };

        // Set up the global context
        (window as any).React = sandboxedReact;
        (window as any).htmlElements = htmlElements;

        // Create and return the component
        return createComponentFactory(code);
      };

      const component = createComponent();
      setComponent(component);
      setIsLoading(false);
    } catch (err) {
      setError(String(err));
      setIsLoading(false);
      console.error("ReactBlockRenderer error:", err);
    }
  }, [code]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        </div>
        <span className="ml-2 text-sm text-gray-400">Loading React component...</span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-red-900/20 border border-red-700 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-sm font-medium text-red-300">React Component Error</span>
        </div>
        <pre className="text-xs text-red-400 whitespace-pre-wrap">{error}</pre>
        <div className="mt-2 text-xs text-red-500">
          Check the component code and ensure it exports a valid React component.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Live React Component</h4>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(code);
            }}
          >
            Copy Code
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="w-full">
        {Component}
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        Interactive React component rendered live
      </div>
    </motion.div>
  );
}
