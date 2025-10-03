import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Course, Enrollment, Lesson } from '../lib/supabase'
import { Play, BookOpen, Trophy, Clock, ChevronRight, Star, Lock } from 'lucide-react'

const Dashboard = () => {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([])
  const [currentLessons, setCurrentLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEnrollments()
    }
  }, [user])

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user?.id)

      if (error) throw error
      setEnrollments(data || [])

      // Fetch current lessons for active courses
      if (data && data.length > 0) {
        const activeCourse = data.find(e => !e.completed_at)
        if (activeCourse) {
          fetchLessons(activeCourse.course_id)
        }
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order')

      if (error) throw error
      setCurrentLessons(data || [])
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeCourse = enrollments.find(e => !e.completed_at)
  const completedCourses = enrollments.filter(e => e.completed_at)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {userProfile?.child_name || 'Young Coder'}! 🚀
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to continue your coding adventure?
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{completedCourses.length}</div>
                <div className="text-sm text-blue-100">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {activeCourse ? Math.round(activeCourse.progress) : 0}%
                </div>
                <div className="text-sm text-blue-100">Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Course */}
            {activeCourse && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{activeCourse.course.duration_weeks} weeks</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeCourse.course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{activeCourse.course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(activeCourse.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${activeCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Lessons</h4>
                  {currentLessons.slice(0, 5).map((lesson, index) => {
                    const isCompleted = (activeCourse.progress / 100) * currentLessons.length > index
                    const isCurrent = Math.floor((activeCourse.progress / 100) * currentLessons.length) === index
                    const isLocked = index > Math.floor((activeCourse.progress / 100) * currentLessons.length)

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          if (!isLocked) {
                            navigate(`/lesson/${lesson.id}`)
                          }
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          isCurrent
                            ? 'border-blue-500 bg-blue-50 cursor-pointer'
                            : isCompleted
                            ? 'border-green-200 bg-green-50 cursor-pointer'
                            : 'border-gray-200 bg-gray-50'
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <Trophy size={20} />
                          ) : isLocked ? (
                            <Lock size={20} />
                          ) : (
                            <Play size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                        </div>
                        {!isLocked && <ChevronRight className="text-gray-400" size={20} />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No Active Course */}
            {!activeCourse && (
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Start Your Coding Journey?
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a course that matches your child's age and interests.
                </p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {completedCourses.map((enrollment, index) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="text-white" size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{enrollment.course.title}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                ))}
                {completedCourses.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Complete your first course to earn achievements!
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Courses Completed</span>
                  <span className="font-semibold">{completedCourses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-semibold">
                    {completedCourses.length === 0 ? 'Beginner' : 
                     completedCourses.length < 2 ? 'Intermediate' : 'Advanced'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Progress</span>
                  <span className="font-semibold">
                    {activeCourse ? Math.round(activeCourse.progress) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard