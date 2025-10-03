// Python code executor using Pyodide (Python in the browser)
import { useState, useEffect } from 'react';

interface PythonExecutorProps {
  code: string;
  onOutput: (output: string) => void;
  onError: (error: string) => void;
}

// Lazy load Pyodide
let pyodideInstance: any = null;

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  
  try {
    // @ts-ignore
    if (typeof window.loadPyodide === 'undefined') {
      // Load Pyodide from CDN
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    
    // @ts-ignore
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });
    
    return pyodideInstance;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw error;
  }
}

export function usePythonExecutor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Preload Pyodide
    loadPyodide()
      .then(() => setIsReady(true))
      .catch(err => console.error('Pyodide load error:', err));
  }, []);
  
  const runPython = async (code: string): Promise<{ output: string; error: string | null }> => {
    try {
      setIsLoading(true);
      
      const pyodide = await loadPyodide();
      
      // Capture stdout
      let output = '';
      pyodide.setStdout({
        batched: (text: string) => {
          output += text + '\n';
        }
      });
      
      // Run the code
      await pyodide.runPythonAsync(code);
      
      setIsLoading(false);
      return { output: output.trim(), error: null };
      
    } catch (error: any) {
      setIsLoading(false);
      return {
        output: '',
        error: error.message || 'An error occurred while running your code'
      };
    }
  };
  
  return { runPython, isLoading, isReady };
}

// Simple fallback executor using eval (for demo purposes only - NOT for production)
export function useSimplePythonExecutor() {
  const [isLoading, setIsLoading] = useState(false);
  
  const runPython = async (code: string): Promise<{ output: string; error: string | null }> => {
    setIsLoading(true);
    
    // Simulate Python execution with JavaScript
    // This is a VERY simplified version just for demo
    try {
      let output = '';
      
      // Extract print statements
      const printRegex = /print\s*\(\s*([^)]+)\s*\)/g;
      let match;
      
      while ((match = printRegex.exec(code)) !== null) {
        let content = match[1];
        
        // Remove quotes
        content = content.replace(/["']/g, '');
        
        // Evaluate simple expressions
        try {
          // Simple variable substitution
          const varRegex = /(\w+)\s*=\s*([^;\n]+)/g;
          const vars: Record<string, any> = {};
          let varMatch;
          
          while ((varMatch = varRegex.exec(code)) !== null) {
            const varName = varMatch[1];
            let varValue = varMatch[2].trim();
            
            // Remove quotes for strings
            if (varValue.startsWith('"') || varValue.startsWith("'")) {
              varValue = varValue.slice(1, -1);
            } else if (!isNaN(Number(varValue))) {
              varValue = Number(varValue);
            }
            
            vars[varName] = varValue;
          }
          
          // Replace variables in print content
          Object.keys(vars).forEach(varName => {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            content = content.replace(regex, String(vars[varName]));
          });
          
          // Handle simple math
          content = content.replace(/(\d+)\s*\+\s*(\d+)/g, (match, a, b) => String(Number(a) + Number(b)));
          content = content.replace(/(\d+)\s*-\s*(\d+)/g, (match, a, b) => String(Number(a) - Number(b)));
          content = content.replace(/(\d+)\s*\*\s*(\d+)/g, (match, a, b) => String(Number(a) * Number(b)));
          content = content.replace(/(\d+)\s*\/\s*(\d+)/g, (match, a, b) => String(Number(a) / Number(b)));
          
          // Handle comma-separated values
          content = content.split(',').map(s => s.trim()).join(' ');
          
        } catch (e) {
          // Keep original if evaluation fails
        }
        
        output += content + '\n';
      }
      
      setIsLoading(false);
      
      if (!output) {
        return {
          output: '',
          error: null
        };
      }
      
      return { output: output.trim(), error: null };
      
    } catch (error: any) {
      setIsLoading(false);
      return {
        output: '',
        error: 'Error running code: ' + error.message
      };
    }
  };
  
  return { runPython, isLoading, isReady: true };
}
