/**
 * Interactive Code Editor - Full-featured code editor with execution, hints, and validation
 */

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Lightbulb, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { codeExecutionService, CodeChallenge, ExecutionResult } from '../../services/code-execution.service';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveCodeEditorProps {
  challenge: CodeChallenge;
  onComplete: (success: boolean, attempts: number) => void;
  onProgress?: (progress: number) => void;
}

export const InteractiveCodeEditor = ({
  challenge,
  onComplete,
  onProgress
}: InteractiveCodeEditorProps) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const editorRef = useRef<any>(null);

  /**
   * Run the code
   */
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    setTestResults(null);
    setAttempts(prev => prev + 1);

    try {
      // Run all test cases
      const results = await codeExecutionService.runTestCases(code, challenge);
      setTestResults(results);

      // Calculate progress
      const progress = (results.passed / results.total) * 100;
      onProgress?.(progress);

      // Check if challenge is complete
      if (results.passed === results.total && !hasCompleted) {
        setHasCompleted(true);
        onComplete(true, attempts + 1);
        
        // Show success output
        setOutput('🎉 Amazing! All tests passed!\n\n' + 
                 results.results.map((r, i) => 
                   `✅ Test ${i + 1}: ${r.testCase.description || 'Passed'}`
                 ).join('\n'));
      } else if (results.passed > 0) {
        // Partial success
        setOutput(`✅ ${results.passed}/${results.total} tests passed! Keep going!\n\n` +
                 results.results.map((r, i) =>
                   r.passed 
                     ? `✅ Test ${i + 1}: ${r.testCase.description || 'Passed'}`
                     : `❌ Test ${i + 1}: ${r.testCase.description || 'Failed'}`
                 ).join('\n'));
      } else {
        // All failed
        const firstFailure = results.results.find(r => !r.passed);
        if (firstFailure?.result.error) {
          setError(firstFailure.result.error);
          
          // Show helpful hint
          const hint = codeExecutionService.getHintForError(
            firstFailure.result.error,
            challenge.language
          );
          setTimeout(() => setOutput(prev => prev + '\n\n' + hint), 1000);
        } else {
          setOutput('❌ All tests failed. Check your logic and try again!');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while running your code');
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Reset code to starter
   */
  const handleReset = () => {
    setCode(challenge.starterCode);
    setOutput('');
    setError('');
    setTestResults(null);
    setShowHint(false);
    setCurrentHintIndex(0);
  };

  /**
   * Show next hint
   */
  const handleShowHint = () => {
    if (!challenge.hints || challenge.hints.length === 0) {
      setOutput('💡 No hints available for this challenge. Try breaking the problem into smaller steps!');
      return;
    }

    setShowHint(true);
    setCurrentHintIndex(prev => Math.min(prev + 1, challenge.hints!.length));
  };

  /**
   * Analyze code for issues
   */
  useEffect(() => {
    if (code && code !== challenge.starterCode) {
      const issues = codeExecutionService.analyzeCode(code, challenge.language);
      if (issues.length > 0 && issues[0].severity === 'error') {
        setError(issues[0].message);
      }
    }
  }, [code, challenge]);

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{challenge.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{challenge.description}</p>
          </div>
        </div>

        {/* Test Results Summary */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(testResults.passed / testResults.total) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    testResults.passed === testResults.total
                      ? 'bg-green-500'
                      : testResults.passed > 0
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {testResults.passed}/{testResults.total} Tests
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {challenge.language === 'python' ? '🐍 Python' : '⚡ JavaScript'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleShowHint}
                className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
                disabled={attempts < 2}
                title={attempts < 2 ? 'Try at least twice before getting a hint!' : ''}
              >
                <Lightbulb className="w-4 h-4" />
                Hint {currentHintIndex > 0 && `(${currentHintIndex}/${challenge.hints?.length || 0})`}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={challenge.language}
              ref={editorRef}
            />
          </div>

          {/* Run Button */}
          <div className="bg-white border-t border-gray-200 p-4">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-full lg:w-96 flex flex-col bg-white">
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">Output</span>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Hints */}
            <AnimatePresence>
              {showHint && challenge.hints && currentHintIndex > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 border-b border-purple-200 p-4"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-900 mb-1">
                        Hint {currentHintIndex}:
                      </p>
                      <p className="text-sm text-purple-800">
                        {challenge.hints[currentHintIndex - 1]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-b border-red-200 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">Error:</p>
                    <p className="text-sm text-red-800 font-mono whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Output */}
            {output && (
              <div className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                  {output}
                </pre>
              </div>
            )}

            {/* Success Celebration */}
            {hasCompleted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 text-center"
              >
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  🎉 Challenge Complete!
                </h3>
                <p className="text-gray-600">
                  Great job! You solved it in {attempts} attempt{attempts !== 1 ? 's' : ''}!
                </p>
              </motion.div>
            )}

            {/* Empty State */}
            {!output && !error && !hasCompleted && (
              <div className="p-6 text-center text-gray-500">
                <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click "Run Code" to see your output here</p>
              </div>
            )}
          </div>

          {/* Attempts Counter */}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <p className="text-xs text-gray-600">
              Attempts: <span className="font-semibold">{attempts}</span>
              {attempts > 0 && testResults && (
                <span className="ml-2">
                  • Last score: {testResults.passed}/{testResults.total}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

