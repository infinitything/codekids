/**
 * Badge Management - Create and manage achievement badges
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Save, X } from 'lucide-react';
import { adminService, Badge } from '../../services/admin.service';
import { env } from '../../lib/env';

const BADGE_ICONS = ['🏆', '⭐', '🎯', '🚀', '💎', '👑', '🔥', '⚡', '🎨', '🎪', '🎭', '🎮', '🏅', '🥇', '🥈', '🥉', '💪', '🧠', '🎓', '📚'];
const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-800',
  rare: 'bg-blue-100 text-blue-800',
  epic: 'bg-purple-100 text-purple-800',
  legendary: 'bg-yellow-100 text-yellow-800',
};

export const BadgeManagement = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Partial<Badge> | null>(null);
  const [formData, setFormData] = useState<Partial<Badge>>({
    name: '',
    description: '',
    icon: '🏆',
    criteria: '',
    points: 10,
    rarity: 'common',
  });

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    setLoading(true);
    if (env.demoMode) {
      setBadges([
        {
          id: '1',
          name: 'First Lesson',
          description: 'Complete your first lesson!',
          icon: '🎓',
          criteria: 'complete_first_lesson',
          points: 10,
          rarity: 'common',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Code Warrior',
          description: 'Complete 10 lessons',
          icon: '⚔️',
          criteria: 'complete_10_lessons',
          points: 50,
          rarity: 'rare',
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Python Master',
          description: 'Complete Python course',
          icon: '🐍',
          criteria: 'complete_python_course',
          points: 100,
          rarity: 'epic',
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }
    const data = await adminService.getAllBadges();
    setBadges(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingBadge(null);
    setFormData({
      name: '',
      description: '',
      icon: '🏆',
      criteria: '',
      points: 10,
      rarity: 'common',
    });
    setShowModal(true);
  };

  const openEditModal = (badge: Badge) => {
    setEditingBadge(badge);
    setFormData(badge);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Demo mode
    if (env.demoMode) {
      if (editingBadge) {
        setBadges(badges.map(b => b.id === editingBadge.id ? { ...b, ...formData } as Badge : b));
        alert('Badge updated successfully! (Demo mode)');
      } else {
        const newBadge: Badge = {
          ...formData as Badge,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        setBadges([...badges, newBadge]);
        alert('Badge created successfully! (Demo mode)');
      }
      setShowModal(false);
      return;
    }

    // Production mode
    if (editingBadge) {
      const result = await adminService.updateBadge(editingBadge.id!, formData);
      if (result.success) {
        alert('Badge updated successfully!');
        loadBadges();
        setShowModal(false);
      } else {
        alert('Error updating badge: ' + result.error);
      }
    } else {
      const result = await adminService.createBadge(formData);
      if (result.success) {
        alert('Badge created successfully!');
        loadBadges();
        setShowModal(false);
      } else {
        alert('Error creating badge: ' + result.error);
      }
    }
  };

  const handleDelete = async (badgeId: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    // Demo mode
    if (env.demoMode) {
      setBadges(badges.filter(b => b.id !== badgeId));
      alert('Badge deleted successfully! (Demo mode)');
      return;
    }

    // Production mode
    const result = await adminService.deleteBadge(badgeId);
    if (result.success) {
      alert('Badge deleted successfully!');
      loadBadges();
    } else {
      alert('Error deleting badge: ' + result.error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Badge Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage achievement badges</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Badge
        </button>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading badges...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-6xl mb-3">{badge.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{badge.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS]}`}>
                  {badge.rarity}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {badge.points} XP
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded">
                {badge.criteria}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(badge)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(badge.id)}
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
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBadge ? 'Edit Badge' : 'Create New Badge'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {BADGE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-3xl p-2 rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Python Master"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complete the entire Python course"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Criteria (Code) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.criteria}
                  onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="e.g., complete_python_course"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use snake_case identifier for badge criteria
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    XP Points *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rarity *
                  </label>
                  <select
                    value={formData.rarity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rarity: e.target.value as 'common' | 'rare' | 'epic' | 'legendary',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingBadge ? 'Update Badge' : 'Create Badge'}
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

