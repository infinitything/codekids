/**
 * Course Management - Full CRUD for courses
 */

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Clock,
  Users,
  Save,
  X,
} from 'lucide-react';
import { adminService, Course } from '../../services/admin.service';
import { FileUpload } from './FileUpload';
import { env } from '../../lib/env';

// Mock data for demo mode
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Python for Beginners',
    description: 'Learn Python programming from scratch',
    level: 'beginner',
    language: 'python',
    duration_hours: 20,
    lessons_count: 15,
    image_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Web Development with React',
    description: 'Build modern web applications',
    level: 'intermediate',
    language: 'javascript',
    duration_hours: 30,
    lessons_count: 25,
    image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Game Design Fundamentals',
    description: 'Create your first video game',
    level: 'beginner',
    language: 'python',
    duration_hours: 25,
    lessons_count: 20,
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    is_published: false,
    created_at: new Date().toISOString(),
  },
];

export const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    level: 'beginner',
    language: 'python',
    duration_hours: 1,
    lessons_count: 1,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    
    // Check demo mode
    if (env.demoMode) {
      // Use mock data
      setTimeout(() => {
        setCourses(MOCK_COURSES);
        setLoading(false);
      }, 500);
      return;
    }
    
    // Production mode - fetch from Supabase
    try {
      const data = await adminService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to mock data on error
      setCourses(MOCK_COURSES);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      level: 'beginner',
      language: 'python',
      duration_hours: 0,
      lessons_count: 0,
    });
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Demo mode - just update local state
    if (env.demoMode) {
      if (editingCourse) {
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } as Course : c));
        alert('Course updated successfully! (Demo mode)');
      } else {
        const newCourse: Course = {
          ...formData as Course,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          is_published: false,
        };
        setCourses([newCourse, ...courses]);
        alert('Course created successfully! (Demo mode)');
      }
      setShowModal(false);
      return;
    }

    // Production mode
    if (editingCourse) {
      const result = await adminService.updateCourse(editingCourse.id!, formData);
      if (result.success) {
        alert('Course updated successfully!');
        loadCourses();
        setShowModal(false);
      } else {
        alert('Error updating course: ' + result.error);
      }
    } else {
      const result = await adminService.createCourse(formData);
      if (result.success) {
        alert('Course created successfully!');
        loadCourses();
        setShowModal(false);
      } else {
        alert('Error creating course: ' + result.error);
      }
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    // Demo mode - just update local state
    if (env.demoMode) {
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Course deleted successfully! (Demo mode)');
      return;
    }

    // Production mode
    const result = await adminService.deleteCourse(courseId);
    if (result.success) {
      alert('Course deleted successfully!');
      loadCourses();
    } else {
      alert('Error deleting course: ' + result.error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create, edit, and manage all courses
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons_count} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration_hours}h
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {course.level}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {course.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(course)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value as 'python' | 'javascript' | 'scratch',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="scratch">Scratch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duration_hours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_hours: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lessons Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lessons_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lessons_count: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image
                </label>
                <FileUpload
                  type="image"
                  folder={`courses/${formData.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  onUploadComplete={(result) => {
                    if (result.success) {
                      setFormData({ ...formData, thumbnail_url: result.url });
                    }
                  }}
                  accept="image/*"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

