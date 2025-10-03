import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pythonBeginnerCourse, scratchBeginnerCourse } from '../lib/curriculum/lessonData';
import { CodeEditor } from '../components/learning/CodeEditor';
import { BlocklyEditor } from '../components/learning/BlocklyEditor';
import { useSimplePythonExecutor } from '../components/learning/PythonExecutor';
import { EnhancedAIChat } from '../components/ai-mentor/EnhancedAIChat';
import { Play, RotateCcw, Lightbulb, CheckCircle, XCircle, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { learningService } from '../services/learning.service';

export const LessonViewerPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeStudentId = ((): string | null => {
    try { return localStorage.getItem('activeStudentId'); } catch { return null; }
  })();
  
  const allLessons = [...pythonBeginnerCourse, ...scratchBeginnerCourse];
  const lesson = allLessons.find(l => l.id === lessonId) || pythonBeginnerCourse[0];
  
  const [code, setCode] = useState(lesson.starterCode || '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challengeStatus, setChallengeStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [showAIChat, setShowAIChat] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { runPython, isLoading } = useSimplePythonExecutor();
  
  useEffect(() => {
    setCode(lesson.starterCode || '');
    setCurrentSection(0);
    setCurrentChallenge(0);
    setOutput('');
    setError(null);
    // Start/track lesson in DB
    if (activeStudentId && lessonId) {
      learningService.startLesson({ studentId: activeStudentId, lessonId }).catch(console.warn);
    }
  }, [lessonId]);
  
  const saveProgress = async (completed: boolean) => {
    if (!activeStudentId || !lessonId) return;
    try {
      if (completed) {
        // Assume perfect for now; could compute from test results
        await learningService.completeLesson({
          studentId: activeStudentId,
          lessonId,
          accuracyScore: 100,
          completionTimeSeconds: 60,
          hintsUsed: showHint ? 1 : 0,
          studentCode: code,
        });
      } else {
        await learningService.updateLessonProgress({
          studentId: activeStudentId,
          lessonId,
          progressPercentage: Math.min(100, Math.round(((currentChallenge + 1) / lesson.challenges.length) * 100)),
          timeSpentSeconds: 10,
          studentCode: code,
        });
      }
    } catch (e) {
      console.warn('Progress save failed:', e);
    }
  };
  
  const handleRunCode = async () => {
    setOutput('');
    setError(null);
    setChallengeStatus('running');
    
    const result = await runPython(code);
    
    if (result.error) {
      setError(result.error);
      setChallengeStatus('error');
    } else {
      setOutput(result.output);
      setChallengeStatus('idle');
    }
  };
  
  const handleCheckChallenge = async () => {
    const challenge = lesson.challenges[currentChallenge];
    if (!challenge) return;
    
    setChallengeStatus('running');
    
    const result = await runPython(code);
    
    if (result.error) {
      setError(result.error);
      setChallengeStatus('error');
      return;
    }
    
    let allPassed = true;
    for (const testCase of challenge.testCases) {
      if (testCase.expectedOutput instanceof RegExp) {
        if (!testCase.expectedOutput.test(code)) {
          allPassed = false;
          break;
        }
      } else if (testCase.expectedOutput) {
        const normalizedOutput = result.output.trim().toLowerCase();
        const normalizedExpected = String(testCase.expectedOutput).trim().toLowerCase();
        if (!normalizedOutput.includes(normalizedExpected)) {
          allPassed = false;
          break;
        }
      }
    }
    
    if (allPassed) {
      setChallengeStatus('success');
      const xpEarned = challenge.xp_reward;
      setEarnedXP(prev => prev + xpEarned);
      
      if (user && activeStudentId) {
        // Partial progress save
        await saveProgress(currentChallenge === lesson.challenges.length - 1);
      }
      
      toast.success(`🎉 Challenge Complete! +${xpEarned} XP`);
      
      if (currentChallenge === lesson.challenges.length - 1) {
        setLessonCompleted(true);
        toast.success('🏆 Lesson Complete!', { duration: 4000 });
      }
      
      setTimeout(() => {
        if (currentChallenge < lesson.challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setChallengeStatus('idle');
          setShowHint(false);
        }
      }, 800);
    } else {
      setChallengeStatus('error');
      setError('Not quite right. Try following the instructions more carefully!');
      toast.error('Keep trying! Check the instructions again.');
    }
  };
  
  const handleReset = () => {
    setCode(lesson.starterCode || '');
    setOutput('');
    setError(null);
    setChallengeStatus('idle');
  };
  
  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    if (currentIndex < allLessons.length - 1) {
      navigate(`/lesson/${allLessons[currentIndex + 1].id}`);
    }
  };
  
  const challenge = lesson.challenges[currentChallenge];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">+{earnedXP} XP</span>
              </div>
              <div className="text-sm text-gray-600">
                {currentChallenge + 1} / {lesson.challenges.length} Challenges
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentChallenge + (challengeStatus === 'success' ? 1 : 0)) / lesson.challenges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Instructions */}
          <div className="space-y-6">
            {/* Current Challenge */}
            {challenge && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{challenge.title}</h2>
                    <p className="text-gray-600 mt-1">{challenge.description}</p>
                  </div>
                  {challengeStatus === 'success' && (
                    <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {challenge.instructions.map((instruction, i) => (
                      <li key={i} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                {/* Hints */}
                <div className="mt-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <Lightbulb className="w-5 h-5" />
                    {showHint ? 'Hide Hint' : 'Need a Hint?'}
                  </button>
                  
                  {showHint && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="space-y-2">
                        {challenge.hints.map((hint, i) => (
                          <p key={i} className="text-sm text-yellow-900">💡 {hint}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* XP Reward */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span>Complete this challenge to earn <strong>{challenge.xp_reward} XP</strong></span>
                </div>
              </div>
            )}
            
            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Lesson Notes</h3>
              <div className="prose prose-sm max-w-none">
                {lesson.sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    <div
                      className="text-gray-700 mt-2"
                      dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right: Code Editor */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                <span className="text-white font-semibold">Code Editor</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-2 transition-colors"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleRunCode}
                    className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 transition-colors"
                    disabled={isLoading}
                  >
                    <Play className="w-4 h-4" />
                    {isLoading ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>
              
              {lesson.editorType === 'monaco' ? (
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language="python"
                  height="400px"
                />
              ) : (
                <BlocklyEditor
                  onChange={(xml) => console.log('Blockly changed:', xml)}
                  height="400px"
                />
              )}
            </div>
            
            {/* Output Console */}
            <div className="bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-white font-semibold text-sm">Output</span>
              </div>
              <div className="p-4 font-mono text-sm min-h-[150px]">
                {isLoading ? (
                  <div className="text-gray-400">Running code...</div>
                ) : error ? (
                  <div className="text-red-400">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">Error:</div>
                        <div className="mt-1">{error}</div>
                      </div>
                    </div>
                  </div>
                ) : output ? (
                  <div className="text-green-400 whitespace-pre-wrap">{output}</div>
                ) : (
                  <div className="text-gray-500">Click "Run Code" to see output...</div>
                )}
              </div>
            </div>
            
            {/* Check Solution Button */}
            {challenge && (
              <button
                onClick={handleCheckChallenge}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                  challengeStatus === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : challengeStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading || challengeStatus === 'success'}
              >
                {challengeStatus === 'success' ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Challenge Complete! 🎉
                  </span>
                ) : (
                  'Check My Solution'
                )}
              </button>
            )}
            
            {/* Next Lesson */}
            {currentChallenge === lesson.challenges.length - 1 && challengeStatus === 'success' && (
              <button
                onClick={handleNextLesson}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Next Lesson
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Chat Widget */}
      <EnhancedAIChat
        studentId={activeStudentId || ''}
        studentAge={10}
        currentLesson={lesson.title}
        isMinimized={!showAIChat}
        onToggleMinimize={() => setShowAIChat(!showAIChat)}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};
