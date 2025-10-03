/**
 * Code Execution Service - Secure code execution for Python & JavaScript
 * Uses Web Workers for JavaScript and Pyodide for Python (browser-based!)
 */

import { pyodideExecutor } from './pyodide-executor.service';

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memory?: number;
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description?: string;
}

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  hints?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'python' | 'javascript';
}

class CodeExecutionService {
  private executionTimeout = 5000; // 5 seconds max execution time

  /**
   * Execute JavaScript code safely in a Web Worker
   */
  async executeJavaScript(code: string, testCase?: TestCase): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      // Create isolated execution context
      const worker = await this.createJavaScriptWorker(code, testCase);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          worker.terminate();
          resolve({
            success: false,
            output: '',
            error: 'Execution timeout: Code took too long to run (max 5 seconds)',
            executionTime: this.executionTimeout,
          });
        }, this.executionTimeout);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          const executionTime = performance.now() - startTime;
          
          if (e.data.error) {
            resolve({
              success: false,
              output: e.data.output || '',
              error: e.data.error,
              executionTime,
            });
          } else {
            resolve({
              success: true,
              output: e.data.output,
              executionTime,
            });
          }
        };

        worker.onerror = (error) => {
          clearTimeout(timeout);
          worker.terminate();
          resolve({
            success: false,
            output: '',
            error: error.message || 'Unknown error occurred',
            executionTime: performance.now() - startTime,
          });
        };
      });
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: performance.now() - startTime,
      };
    }
  }

  /**
   * Execute Python code using Pyodide (browser-based Python!)
   */
  async executePython(code: string, testCase?: TestCase): Promise<ExecutionResult> {
    try {
      if (testCase) {
        return await pyodideExecutor.executePythonWithInput(code, testCase.input);
      } else {
        return await pyodideExecutor.executePython(code);
      }
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message || 'Python execution failed',
        executionTime: 0,
      };
    }
  }

  /**
   * Run all test cases for a challenge
   */
  async runTestCases(code: string, challenge: CodeChallenge): Promise<{
    passed: number;
    total: number;
    results: Array<{testCase: TestCase; result: ExecutionResult; passed: boolean}>;
  }> {
    const results = await Promise.all(
      challenge.testCases.map(async (testCase) => {
        const result = challenge.language === 'javascript'
          ? await this.executeJavaScript(code, testCase)
          : await this.executePython(code, testCase);

        const passed = result.success && this.validateOutput(result.output, testCase.expectedOutput);

        return { testCase, result, passed };
      })
    );

    const passed = results.filter((r) => r.passed).length;

    return {
      passed,
      total: challenge.testCases.length,
      results,
    };
  }

  /**
   * Create Web Worker for JavaScript execution
   */
  private async createJavaScriptWorker(code: string, testCase?: TestCase): Promise<Worker> {
    const workerCode = `
      self.console = {
        log: (...args) => {
          self.postMessage({ output: args.map(String).join(' ') });
        },
        error: (...args) => {
          self.postMessage({ error: args.map(String).join(' ') });
        }
      };

      // Capture outputs
      let outputs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        outputs.push(args.map(String).join(' '));
      };

      try {
        ${testCase ? `const input = ${JSON.stringify(testCase.input)};` : ''}
        
        ${code}
        
        self.postMessage({
          output: outputs.join('\\n'),
          error: null
        });
      } catch (error) {
        self.postMessage({
          output: outputs.join('\\n'),
          error: error.message || String(error)
        });
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    return new Worker(workerUrl);
  }

  /**
   * Pre-load Python runtime (call this on app init for faster first execution)
   */
  async preloadPython(): Promise<void> {
    try {
      await pyodideExecutor.initialize();
      console.log('✅ Python runtime pre-loaded and ready!');
    } catch (error) {
      console.error('❌ Failed to pre-load Python runtime:', error);
    }
  }

  /**
   * Validate execution output against expected output
   */
  private validateOutput(actual: string, expected: any): boolean {
    try {
      // Handle different output formats
      const normalizedActual = actual.trim().toLowerCase();
      const normalizedExpected = String(expected).trim().toLowerCase();

      // Exact match
      if (normalizedActual === normalizedExpected) return true;

      // JSON comparison
      try {
        const actualJSON = JSON.parse(actual);
        const expectedJSON = typeof expected === 'string' ? JSON.parse(expected) : expected;
        return JSON.stringify(actualJSON) === JSON.stringify(expectedJSON);
      } catch {
        // Not JSON, continue with string comparison
      }

      // Numeric comparison (handles floating point)
      const actualNum = parseFloat(actual);
      const expectedNum = parseFloat(String(expected));
      if (!isNaN(actualNum) && !isNaN(expectedNum)) {
        return Math.abs(actualNum - expectedNum) < 0.0001;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get code hints based on error
   */
  getHintForError(error: string, language: 'python' | 'javascript'): string {
    const hints: Record<string, string> = {
      'undefined': '💡 Hint: Make sure all variables are defined before using them',
      'syntax': '💡 Hint: Check your syntax - did you forget a bracket, quote, or semicolon?',
      'reference': '💡 Hint: This variable or function doesn\'t exist. Check the spelling!',
      'type': '💡 Hint: You\'re trying to use the wrong type of data. Check if it should be a number, string, etc.',
      'timeout': '💡 Hint: Your code is taking too long. Do you have an infinite loop?',
      'indentation': '💡 Hint: Python requires proper indentation. Make sure your code is aligned correctly!',
      'missing': '💡 Hint: Something is missing - maybe a colon, parenthesis, or closing bracket?',
    };

    const errorLower = error.toLowerCase();
    
    for (const [key, hint] of Object.entries(hints)) {
      if (errorLower.includes(key)) {
        return hint;
      }
    }

    return '💡 Hint: Read the error message carefully - it usually tells you what went wrong!';
  }

  /**
   * Analyze code for common issues (linting)
   */
  analyzeCode(code: string, language: 'python' | 'javascript'): Array<{
    line: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }> {
    const issues: Array<{line: number; message: string; severity: 'error' | 'warning' | 'info'}> = [];

    if (language === 'javascript') {
      // Check for console.log in final code
      if (code.includes('console.log') && code.split('console.log').length > 3) {
        issues.push({
          line: 0,
          message: 'Too many console.log statements. Consider removing debugging code.',
          severity: 'warning',
        });
      }

      // Check for var usage
      if (code.includes('var ')) {
        issues.push({
          line: 0,
          message: 'Consider using "let" or "const" instead of "var"',
          severity: 'info',
        });
      }
    }

    if (language === 'python') {
      // Check for print statements
      if (code.includes('print(') && code.split('print(').length > 3) {
        issues.push({
          line: 0,
          message: 'Multiple print statements found. Make sure they\'re intentional.',
          severity: 'info',
        });
      }
    }

    return issues;
  }
}

export const codeExecutionService = new CodeExecutionService();

