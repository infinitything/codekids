import { useState, useEffect } from 'react';
import { learningService } from '../../services/learning.service';
import { Lesson, LessonProgress } from '../../types/database.types';
import { CodeEditor } from './CodeEditor';
import { BlocklyEditor } from './BlocklyEditor';
import { AIChatWidget } from '../ai-mentor/AIChatWidget';
import { Book, Clock, Star, CheckCircle, Lightbulb, Play } from 'lucide-react';

interface LessonViewerProps {
  lessonId: string;
  studentId: string;
  onComplete?: () => void;
}

export const LessonViewer = ({ lessonId, studentId, onComplete }: LessonViewerProps) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    
    const { lesson } = await learningService.getLesson(lessonId);
    const { progress } = await learningService.getStudentLessonProgress(studentId, lessonId);

    if (lesson) {
      setLesson(lesson);
      setCode(progress?.student_code || lesson.starter_code || '');
      
      if (!progress) {
        // Start the lesson
        await learningService.startLesson({ studentId, lessonId });
      }
      
      setProgress(progress);
    }
    
    setLoading(false);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    // Auto-save every 30 seconds could be implemented here
  };

  const handleRunCode = () => {
    // Execute code logic here
    console.log('Running code:', code);
  };

  const handleNextHint = () => {
    if (!lesson?.hints || currentHintLevel >= lesson.hints.length - 1) return;
    setCurrentHintLevel(currentHintLevel + 1);
    setShowHint(true);
  };

  const handleCompleteLesson = async () => {
    if (!lesson) return;

    const completionTime = 30 * 60; // TODO: Track actual time
    const { progress } = await learningService.completeLesson({
      studentId,
      lessonId,
      accuracyScore: 100,
      completionTimeSeconds: completionTime,
      hintsUsed: currentHintLevel + 1,
      studentCode: code,
    });

    if (progress) {
      onComplete?.();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  const isVisualLesson = lesson.lesson_type === 'visual';

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimated_minutes} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{lesson.xp_reward} XP</span>
              </div>
              {progress && (
                <div className="flex items-center gap-1">
                  <span className="text-blue-600 font-semibold">
                    {progress.progress_percentage.toFixed(0)}% Complete
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Hints ({currentHintLevel + 1}/{lesson.hints?.length || 0})
            </button>
            <button
              onClick={handleRunCode}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Run Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6 grid grid-cols-2 gap-6">
          {/* Left Panel - Instructions */}
          <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                Instructions
              </h2>
              
              <p className="text-gray-700 mb-6">{lesson.description}</p>

              {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">What You'll Learn:</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    {lesson.learning_objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.video_url && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Video Tutorial:</h3>
                  <div className="aspect-video bg-gray-900 rounded-lg">
                    <iframe
                      src={lesson.video_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Hint Display */}
              {showHint && lesson.hints && lesson.hints[currentHintLevel] && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Hint #{currentHintLevel + 1}
                  </h3>
                  <p className="text-yellow-800">{lesson.hints[currentHintLevel].text}</p>
                  {lesson.hints[currentHintLevel].code_snippet && (
                    <pre className="bg-yellow-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                      <code>{lesson.hints[currentHintLevel].code_snippet}</code>
                    </pre>
                  )}
                  {currentHintLevel < lesson.hints.length - 1 && (
                    <button
                      onClick={handleNextHint}
                      className="mt-3 text-sm text-yellow-700 hover:text-yellow-900 font-semibold"
                    >
                      Need another hint? →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              {isVisualLesson ? (
                <BlocklyEditor
                  initialCode={code}
                  onChange={handleCodeChange}
                />
              ) : (
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  language={lesson.lesson_type === 'ai_ml' ? 'python' : 'javascript'}
                />
              )}
            </div>

            {/* Output Console */}
            <div className="h-48 bg-gray-900 text-green-400 p-4 font-mono text-sm overflow-y-auto">
              <div className="text-gray-500">Console Output:</div>
              <div>Ready to run your code! Click "Run Code" above.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            ← Previous Lesson
          </button>
          
          <button
            onClick={handleCompleteLesson}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Complete
          </button>

          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Next Lesson →
          </button>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget studentId={studentId} lessonId={lessonId} />
    </div>
  );
};
