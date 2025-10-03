/**
 * Lesson Management - Full CRUD for lessons with video/PDF upload
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Video, FileText, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { adminService, Lesson } from '../../services/admin.service';
import { FileUpload } from './FileUpload';
import { env } from '../../lib/env';

export const LessonManagement = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [formData, setFormData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    content: '',
    duration_minutes: 0,
    order_number: 0,
    is_free: false,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    if (env.demoMode) {
      setCourses([
        { id: '1', title: 'Python Basics', lessons_count: 12 },
        { id: '2', title: 'JavaScript Fundamentals', lessons_count: 15 },
        { id: '3', title: 'Web Development', lessons_count: 20 },
      ]);
      return;
    }
    const data = await adminService.getAllCourses();
    setCourses(data);
  };

  const loadLessons = async (courseId: string) => {
    setLoading(true);
    
    // Demo mode
    if (env.demoMode) {
      setTimeout(() => {
        setLessons([
          {
            id: '1',
            course_id: courseId,
            title: 'Introduction to Variables',
            description: 'Learn about variables and data types',
            content: `# Variables\n\nVariables store data...`,
            order_number: 1,
            duration_minutes: 30,
            is_free: true,
            video_url: 'https://example.com/video1.mp4',
            pdf_url: 'https://example.com/notes1.pdf',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            course_id: courseId,
            title: 'Control Flow',
            description: 'If statements and loops',
            content: `# Control Flow\n\nUse if statements...`,
            order_number: 2,
            duration_minutes: 45,
            is_free: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 400);
      return;
    }
    const data = await adminService.getLessonsByCourse(courseId);
    setLessons(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      course_id: selectedCourse,
      title: '',
      description: '',
      content: '',
      duration_minutes: 0,
      order_number: lessons.length + 1,
      is_free: false,
    });
    setShowModal(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData(lesson);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Demo mode - just update local state
    if (env.demoMode) {
      if (editingLesson) {
        setLessons(lessons.map(l => l.id === editingLesson.id ? { ...l, ...formData } as Lesson : l));
        alert('Lesson updated successfully! (Demo mode)');
      } else {
        const newLesson: Lesson = {
          ...formData as Lesson,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setLessons([...lessons, newLesson]);
        alert('Lesson created successfully! (Demo mode)');
      }
      setShowModal(false);
      return;
    }

    // Production mode
    if (editingLesson) {
      const result = await adminService.updateLesson(editingLesson.id!, formData);
      if (result.success) {
        alert('Lesson updated successfully!');
        loadLessons(selectedCourse);
        setShowModal(false);
      } else {
        alert('Error updating lesson: ' + result.error);
      }
    } else {
      const result = await adminService.createLesson(formData);
      if (result.success) {
        alert('Lesson created successfully!');
        loadLessons(selectedCourse);
        setShowModal(false);
      } else {
        alert('Error creating lesson: ' + result.error);
      }
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    // Demo mode
    if (env.demoMode) {
      setLessons(lessons.filter(l => l.id !== lessonId));
      alert('Lesson deleted successfully! (Demo mode)');
      return;
    }

    // Production mode
    const result = await adminService.deleteLesson(lessonId);
    if (result.success) {
      alert('Lesson deleted successfully!');
      loadLessons(selectedCourse);
    } else {
      alert('Error deleting lesson: ' + result.error);
    }
  };

  const moveLesson = async (lessonId: string, direction: 'up' | 'down') => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const newOrder = direction === 'up' ? lesson.order_number - 1 : lesson.order_number + 1;
    if (newOrder < 1 || newOrder > lessons.length) return;

    await adminService.updateLesson(lessonId, { order_number: newOrder });
    loadLessons(selectedCourse);
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lesson Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage course lessons</p>
        </div>
        {selectedCourse && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Lesson
          </button>
        )}
      </div>

      {/* Course Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.lessons_count} lessons)
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Lessons List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading lessons...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
                >
                  {/* Order Number */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveLesson(lesson.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-500 text-center">
                      #{lesson.order_number}
                    </span>
                    <button
                      onClick={() => moveLesson(lesson.id, 'down')}
                      disabled={index === filteredLessons.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
                      {lesson.is_free && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {lesson.duration_minutes} min
                      </span>
                      {lesson.video_url && (
                        <span className="text-blue-600">📹 Has Video</span>
                      )}
                      {lesson.pdf_url && (
                        <span className="text-red-600">📄 Has PDF</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(lesson)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Content (Markdown)
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="# Lesson Title&#10;&#10;## Introduction&#10;Write your lesson content in Markdown..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order_number}
                    onChange={(e) =>
                      setFormData({ ...formData, order_number: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-7">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Free Preview Lesson</span>
                  </label>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  Lesson Video
                </label>
                <FileUpload
                  type="video"
                  folder={`lessons/${formData.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  onUploadComplete={(result) => {
                    if (result.success) {
                      setFormData({ ...formData, video_url: result.url });
                      alert('Video uploaded successfully!');
                    }
                  }}
                  accept="video/*"
                />
                {formData.video_url && (
                  <p className="text-sm text-green-600 mt-2">✅ Video uploaded: {formData.video_url}</p>
                )}
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Course Materials (PDF)
                </label>
                <FileUpload
                  type="pdf"
                  folder={`lessons/${formData.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  onUploadComplete={(result) => {
                    if (result.success) {
                      setFormData({ ...formData, pdf_url: result.url });
                      alert('PDF uploaded successfully!');
                    }
                  }}
                  accept=".pdf"
                />
                {formData.pdf_url && (
                  <p className="text-sm text-green-600 mt-2">✅ PDF uploaded: {formData.pdf_url}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingLesson ? 'Update Lesson' : 'Create Lesson'}
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

