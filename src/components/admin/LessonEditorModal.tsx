import { useEffect, useState } from 'react';
import { X, Save, Video, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FileUpload } from './FileUpload';

interface LessonEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  lesson?: any | null;
}

export const LessonEditorModal = ({ open, onClose, onSaved, lesson }: LessonEditorModalProps) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    track_id: '',
    title: '',
    description: '',
    lesson_type: 'visual',
    difficulty_level: 'beginner',
    sequence_order: 1,
    estimated_minutes: 30,
    video_url: '',
    content_blocks: [] as any[],
    xp_reward: 100,
    active: true,
  });

  useEffect(() => {
    if (!open) return;
    loadTracks();
  }, [open]);

  useEffect(() => {
    if (lesson) {
      setForm({
        track_id: lesson.track_id || '',
        title: lesson.title || '',
        description: lesson.description || '',
        lesson_type: lesson.lesson_type || 'visual',
        difficulty_level: lesson.difficulty_level || 'beginner',
        sequence_order: lesson.sequence_order || 1,
        estimated_minutes: lesson.estimated_minutes || 30,
        video_url: lesson.video_url || '',
        content_blocks: lesson.content_blocks || [],
        xp_reward: lesson.xp_reward || 100,
        active: lesson.active ?? true,
      });
    } else {
      setForm((f: any) => ({ ...f, title: '', description: '', video_url: '', content_blocks: [] }));
    }
  }, [lesson]);

  const loadTracks = async () => {
    const { data } = await supabase.rpc('admin_list_learning_tracks');
    setTracks((data as any[]) || []);
    if (!lesson && data && (data as any[]).length > 0) {
      setForm((f: any) => ({ ...f, track_id: f.track_id || (data as any[])[0].id }));
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.track_id) throw new Error('Select a track');
      if (!payload.title) throw new Error('Title is required');

      if (lesson?.id) {
        const { error } = await supabase.rpc('admin_update_lesson', {
          p_id: lesson.id,
          p_track_id: payload.track_id,
          p_title: payload.title,
          p_description: payload.description,
          p_lesson_type: payload.lesson_type,
          p_difficulty: payload.difficulty_level,
          p_sequence_order: payload.sequence_order,
          p_estimated_minutes: payload.estimated_minutes,
          p_content_blocks: payload.content_blocks,
          p_video_url: payload.video_url,
          p_xp_reward: payload.xp_reward,
          p_active: payload.active,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('admin_create_lesson', {
          p_track_id: payload.track_id,
          p_title: payload.title,
          p_description: payload.description,
          p_lesson_type: payload.lesson_type,
          p_difficulty: payload.difficulty_level,
          p_sequence_order: payload.sequence_order,
          p_estimated_minutes: payload.estimated_minutes,
          p_content_blocks: payload.content_blocks,
          p_video_url: payload.video_url,
          p_xp_reward: payload.xp_reward,
          p_active: payload.active,
        });
        if (error) throw error;
      }
      onSaved();
      onClose();
    } catch (e) {
      console.error('Save lesson error:', e);
      alert((e as any)?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold">{lesson ? 'Edit Lesson' : 'Create Lesson'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Track</label>
              <select
                value={form.track_id}
                onChange={(e) => setForm({ ...form, track_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sequence Order</label>
              <input type="number" value={form.sequence_order} onChange={(e) => setForm({ ...form, sequence_order: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={form.difficulty_level} onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><Video className="w-4 h-4 inline mr-1" />Lesson Video</label>
              <FileUpload type="video" folder={`lessons/${form.title?.replace(/\s+/g, '-').toLowerCase()}`} onUploadComplete={(res) => { if (res.success && res.url) setForm({ ...form, video_url: res.url }); }} accept="video/*" />
              {form.video_url && <p className="text-xs text-green-600 mt-1">Video: {form.video_url}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2"><FileText className="w-4 h-4 inline mr-1" />Notes (PDF)</label>
              <FileUpload type="pdf" folder={`lessons/${form.title?.replace(/\s+/g, '-').toLowerCase()}`} onUploadComplete={(res) => {
                if (res.success && res.url) {
                  const blocks = Array.isArray(form.content_blocks) ? [...form.content_blocks] : [];
                  blocks.push({ type: 'document', content: res.url, order: blocks.length + 1 });
                  setForm({ ...form, content_blocks: blocks });
                }
              }} accept=".pdf" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Markdown)</label>
            <textarea rows={6} value={(Array.isArray(form.content_blocks) ? form.content_blocks.find((b: any) => b.type === 'text')?.content : '') || ''} onChange={(e) => {
              const blocks = Array.isArray(form.content_blocks) ? [...form.content_blocks] : [];
              const idx = blocks.findIndex((b: any) => b.type === 'text');
              if (idx >= 0) blocks[idx] = { ...blocks[idx], content: e.target.value, order: 1, type: 'text' };
              else blocks.unshift({ type: 'text', content: e.target.value, order: 1 });
              setForm({ ...form, content_blocks: blocks });
            }} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder="# Notes..." />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


