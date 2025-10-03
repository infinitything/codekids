/**
 * Quiz Builder - Create and manage quizzes/assessments
 */

import { useState } from 'react';
import { Plus, Trash2, Save, X, HelpCircle, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'coding';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export const QuizBuilder = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const addQuestion = (question: Question) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === question.id ? question : q));
    } else {
      setQuestions([...questions, { ...question, id: Date.now().toString() }]);
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveQuiz = () => {
    const quiz = {
      title: quizTitle,
      description: quizDescription,
      passing_score: passingScore,
      time_limit_minutes: timeLimit,
      questions: questions,
    };
    console.log('Saving quiz:', quiz);
    alert('Quiz saved successfully! (Demo mode)');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Builder</h2>
          <p className="text-sm text-gray-600">Create assessments and quizzes</p>
        </div>
        <button
          onClick={saveQuiz}
          disabled={!quizTitle || questions.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Save Quiz
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Quiz Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title *</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Python Variables Quiz"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Brief description of the quiz..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
          <button
            onClick={() => setShowQuestionModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-500">Q{index + 1}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {q.type.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {q.points} pts
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{q.question}</p>
                  {q.options && (
                    <div className="space-y-1 ml-4">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {opt === q.correctAnswer ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 rounded-full" />
                          )}
                          <span className={opt === q.correctAnswer ? 'text-green-600 font-medium' : ''}>
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSave={addQuestion}
          question={editingQuestion}
        />
      )}
    </div>
  );
};

const QuestionModal = ({ onClose, onSave, question }: any) => {
  const [type, setType] = useState<'multiple_choice' | 'true_false' | 'coding'>(question?.type || 'multiple_choice');
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '');
  const [points, setPoints] = useState(question?.points || 10);
  const [explanation, setExplanation] = useState(question?.explanation || '');

  const handleSave = () => {
    if (!questionText || !correctAnswer) {
      alert('Please fill in required fields');
      return;
    }

    onSave({
      id: question?.id || Date.now().toString(),
      type,
      question: questionText,
      options: type === 'multiple_choice' ? options.filter(o => o) : undefined,
      correctAnswer,
      points,
      explanation,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Add Question</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="coding">Coding Challenge</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Enter your question..."
            />
          </div>

          {type === 'multiple_choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              {options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  placeholder={`Option ${i + 1}`}
                />
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
            {type === 'true_false' ? (
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select...</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : type === 'multiple_choice' ? (
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select correct option...</option>
                {options.filter(o => o).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <textarea
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                rows={4}
                placeholder="Expected code or output..."
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
              placeholder="Explain the answer..."
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

