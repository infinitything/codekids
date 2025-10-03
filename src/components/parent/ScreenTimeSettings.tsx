import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ScreenTimeSetting } from '../../types/database.types';
import { Clock, Save } from 'lucide-react';

interface ScreenTimeSettingsProps {
  studentId: string;
}

export const ScreenTimeSettings = ({ studentId }: ScreenTimeSettingsProps) => {
  const [settings, setSettings] = useState<ScreenTimeSetting | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [studentId]);

  const loadSettings = async () => {
    // Check if demo mode
    const isDemoMode = studentId.includes('student-') || studentId.includes('demo');
    
    if (isDemoMode) {
      // Return mock settings for demo mode
      const mockSettings: ScreenTimeSetting = {
        id: 'demo-settings',
        student_id: studentId,
        daily_limit_minutes: 120,
        weekly_limit_minutes: 600,
        allowed_days: [1, 2, 3, 4, 5, 6, 0],
        allowed_time_start: '08:00',
        allowed_time_end: '20:00',
        break_reminder_enabled: true,
        break_interval_minutes: 30,
        updated_at: new Date().toISOString()
      };
      setSettings(mockSettings);
      return;
    }

    const { data } = await supabase
      .from('screen_time_settings')
      .select('*')
      .eq('student_id', studentId)
      .single();

    setSettings(data);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    
    // Check if demo mode - don't save to database
    const isDemoMode = studentId.includes('student-') || studentId.includes('demo');
    
    if (isDemoMode) {
      // Simulate save in demo mode
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaving(false);
      setEditing(false);
      return;
    }
    
    const { error } = await supabase
      .from('screen_time_settings')
      .upsert({
        ...settings,
        student_id: studentId,
      });

    setSaving(false);

    if (!error) {
      setEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Screen Time Controls
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            Edit Settings
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Time Limit (minutes)
          </label>
          <input
            type="number"
            value={settings?.daily_limit_minutes || ''}
            onChange={(e) => setSettings({ ...settings!, daily_limit_minutes: parseInt(e.target.value) })}
            disabled={!editing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
            placeholder="e.g., 60"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Time Limit (minutes)
          </label>
          <input
            type="number"
            value={settings?.weekly_limit_minutes || ''}
            onChange={(e) => setSettings({ ...settings!, weekly_limit_minutes: parseInt(e.target.value) })}
            disabled={!editing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
            placeholder="e.g., 420"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings?.break_reminder_enabled || false}
              onChange={(e) => setSettings({ ...settings!, break_reminder_enabled: e.target.checked })}
              disabled={!editing}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Enable break reminders (20-20-20 rule)</span>
          </label>
        </div>

        {!settings && !editing && (
          <div className="text-center py-4 text-gray-500">
            No screen time limits set. Click "Edit Settings" to configure.
          </div>
        )}
      </div>
    </div>
  );
};
