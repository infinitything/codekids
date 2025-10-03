/**
 * Platform Settings - Configure platform-wide settings
 */

import { useState } from 'react';
import { Save, Globe, Mail, CreditCard, Shield, Bell, Palette } from 'lucide-react';

export const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'CodeKid',
    siteUrl: 'https://codekid.com',
    supportEmail: 'support@codekid.com',
    allowRegistration: true,
    requireEmailVerification: true,
    enablePayments: true,
    currency: 'USD',
    theme: 'light',
    maintenanceMode: false,
  });

  const saveSettings = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully! (Demo mode)');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
          <p className="text-sm text-gray-600">Configure your platform</p>
        </div>
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">General Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Authentication</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Allow new user registration</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Require email verification</span>
            </label>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Payment Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.enablePayments}
                  onChange={(e) => setSettings({ ...settings, enablePayments: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Enable payments</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Maintenance</h3>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4"
            />
            <div>
              <span className="text-sm font-medium">Maintenance Mode</span>
              <p className="text-xs text-gray-500">Only admins can access the site</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

