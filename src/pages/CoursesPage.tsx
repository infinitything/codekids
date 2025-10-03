import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pythonBeginnerCourse, scratchBeginnerCourse } from '../lib/curriculum/lessonData';
import { Book, Clock, Trophy, ArrowLeft, Play, Star } from 'lucide-react';

export const CoursesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const allCourses = [
    {
      id: 'python-beginner',
      title: 'Python for Kids',
      description: 'Learn Python programming from scratch! Build games, solve puzzles, and create amazing projects.',
      lessons: pythonBeginnerCourse,
      ageGroup: '8-12',
      difficulty: 'Beginner',
      duration: '6 weeks',
      totalXP: pythonBeginnerCourse.reduce((sum, lesson) => sum + lesson.xp_reward, 0),
      category: 'python',
      image: '🐍',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'scratch-beginner',
      title: 'Block Coding Adventures',
      description: 'Start your coding journey with colorful blocks! Create animations, games, and interactive stories.',
      lessons: scratchBeginnerCourse,
      ageGroup: '5-8',
      difficulty: 'Beginner',
      duration: '4 weeks',
      totalXP: scratchBeginnerCourse.reduce((sum, lesson) => sum + lesson.xp_reward, 0),
      category: 'scratch',
      image: '🎨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'web-dev-intro',
      title: 'Build Your First Website',
      description: 'Create cool websites with HTML, CSS, and JavaScript. Design, style, and bring your ideas to life!',
      lessons: [],
      ageGroup: '10-14',
      difficulty: 'Beginner',
      duration: '8 weeks',
      totalXP: 2000,
      category: 'web-dev',
      image: '🌐',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'game-dev',
      title: 'Game Development',
      description: 'Build your own video games! Learn game design, physics, and create playable games.',
      lessons: [],
      ageGroup: '10-16',
      difficulty: 'Intermediate',
      duration: '10 weeks',
      totalXP: 3000,
      category: 'game-dev',
      image: '🎮',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'ai-intro',
      title: 'Introduction to AI',
      description: 'Discover the world of Artificial Intelligence! Build chatbots, image recognizers, and smart apps.',
      lessons: [],
      ageGroup: '12-16',
      difficulty: 'Advanced',
      duration: '12 weeks',
      totalXP: 5000,
      category: 'ai-ml',
      image: '🤖',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'mobile-apps',
      title: 'Mobile App Development',
      description: 'Create apps for phones and tablets! Learn to build real apps people can use.',
      lessons: [],
      ageGroup: '12-16',
      difficulty: 'Advanced',
      duration: '10 weeks',
      totalXP: 4000,
      category: 'mobile',
      image: '📱',
      color: 'from-yellow-500 to-orange-500'
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'python', name: 'Python' },
    { id: 'scratch', name: 'Block Coding' },
    { id: 'web-dev', name: 'Web Development' },
    { id: 'game-dev', name: 'Game Dev' },
    { id: 'ai-ml', name: 'AI & ML' },
    { id: 'mobile', name: 'Mobile Apps' }
  ];
  
  const filteredCourses = selectedCategory === 'all'
    ? allCourses
    : allCourses.filter(c => c.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
              <p className="text-gray-600 mt-1">Choose your next coding adventure!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                if (course.lessons.length > 0) {
                  navigate(`/lesson/${course.lessons[0].id}`);
                }
              }}
            >
              {/* Course Header with Gradient */}
              <div className={`h-32 bg-gradient-to-r ${course.color} flex items-center justify-center relative`}>
                <div className="text-6xl">{course.image}</div>
                {course.lessons.length === 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    Coming Soon
                  </div>
                )}
              </div>
              
              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Ages {course.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Book className="w-4 h-4 text-blue-500" />
                    <span>{course.lessons.length > 0 ? `${course.lessons.length} Lessons` : '12 Lessons'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-700">{course.totalXP} XP</span>
                  </div>
                </div>
                
                {/* Difficulty Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800'
                      : course.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                
                {/* Start Button */}
                {course.lessons.length > 0 ? (
                  <button
                    onClick={() => navigate(`/lesson/${course.lessons[0].id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Start Learning
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};
