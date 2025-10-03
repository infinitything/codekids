/**
 * Pyodide Python Executor - Browser-based Python execution
 * This runs Python code directly in the browser using Pyodide!
 */

import { ExecutionResult } from './code-execution.service';

// Declare Pyodide types
declare global {
  interface Window {
    loadPyodide: any;
  }
}

class PyodideExecutorService {
  private pyodide: any = null;
  private loading: boolean = false;
  private loadPromise: Promise<void> | null = null;

  /**
   * Initialize Pyodide (loads Python runtime)
   */
  async initialize(): Promise<void> {
    if (this.pyodide) return; // Already loaded

    if (this.loading) {
      // Wait for existing load
      if (this.loadPromise) {
        await this.loadPromise;
      }
      return;
    }

    this.loading = true;
    this.loadPromise = this._loadPyodide();
    
    try {
      await this.loadPromise;
    } finally {
      this.loading = false;
    }
  }

  private async _loadPyodide(): Promise<void> {
    try {
      console.log('🐍 Loading Pyodide...');
      
      // Load Pyodide from CDN
      if (!window.loadPyodide) {
        await this.loadPyodideScript();
      }

      this.pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      console.log('✅ Pyodide loaded successfully!');
    } catch (error) {
      console.error('❌ Failed to load Pyodide:', error);
      throw new Error('Failed to load Python runtime');
    }
  }

  /**
   * Load Pyodide script dynamically
   */
  private loadPyodideScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Execute Python code
   */
  async executePython(code: string): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      // Ensure Pyodide is loaded
      await this.initialize();

      // Capture stdout
      const captureCode = `
import sys
import io

# Redirect stdout
sys.stdout = io.StringIO()

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    raise

# Get output
output = sys.stdout.getvalue()
output
`;

      // Execute the code
      const result = await this.pyodide.runPythonAsync(captureCode);
      const executionTime = performance.now() - startTime;

      return {
        success: true,
        output: result || '(No output)',
        executionTime,
      };
    } catch (error: any) {
      const executionTime = performance.now() - startTime;
      
      // Parse Python error
      const errorMessage = this.parsePythonError(error);

      return {
        success: false,
        output: '',
        error: errorMessage,
        executionTime,
      };
    }
  }

  /**
   * Execute Python code with test case
   */
  async executePythonWithInput(code: string, input: any): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      await this.initialize();

      // Setup code with input
      const fullCode = `
import sys
import io
import json

# Set input
input_data = ${JSON.stringify(input)}

# Redirect stdout
sys.stdout = io.StringIO()

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    raise

# Get output
output = sys.stdout.getvalue()
output
`;

      const result = await this.pyodide.runPythonAsync(fullCode);
      const executionTime = performance.now() - startTime;

      return {
        success: true,
        output: result || '(No output)',
        executionTime,
      };
    } catch (error: any) {
      const executionTime = performance.now() - startTime;
      
      return {
        success: false,
        output: '',
        error: this.parsePythonError(error),
        executionTime,
      };
    }
  }

  /**
   * Parse Python error messages
   */
  private parsePythonError(error: any): string {
    let errorMsg = error.message || String(error);

    // Clean up common Pyodide error patterns
    errorMsg = errorMsg.replace(/PythonError: /, '');
    errorMsg = errorMsg.replace(/Traceback \(most recent call last\):.*?\n/g, '');
    
    // Make error more friendly for kids
    if (errorMsg.includes('SyntaxError')) {
      return `Syntax Error: There's something wrong with how you wrote your code. Check for missing colons (:) or parentheses.`;
    }
    
    if (errorMsg.includes('NameError')) {
      const match = errorMsg.match(/name '(.+?)' is not defined/);
      if (match) {
        return `Name Error: You're trying to use '${match[1]}' but it doesn't exist. Did you forget to create it?`;
      }
      return `Name Error: You're using something that doesn't exist. Check your variable names!`;
    }
    
    if (errorMsg.includes('TypeError')) {
      return `Type Error: You're trying to use data in the wrong way. For example, you can't add text to a number!`;
    }
    
    if (errorMsg.includes('IndentationError')) {
      return `Indentation Error: Python is very picky about spaces! Make sure your code is indented correctly.`;
    }
    
    if (errorMsg.includes('ValueError')) {
      return `Value Error: The value you're using isn't right for what you're trying to do.`;
    }

    // Return cleaned error
    return errorMsg.split('\n')[0] || 'An error occurred';
  }

  /**
   * Check if Pyodide is ready
   */
  isReady(): boolean {
    return this.pyodide !== null;
  }

  /**
   * Install a Python package
   */
  async installPackage(packageName: string): Promise<void> {
    await this.initialize();
    await this.pyodide.loadPackage(packageName);
    console.log(`📦 Installed package: ${packageName}`);
  }
}

export const pyodideExecutor = new PyodideExecutorService();

