/**
 * Bulk Operations - Import/Export users and data
 */

import { Upload, Download, FileText, Users } from 'lucide-react';

export const BulkOperations = () => {
  const handleImport = (type: string) => {
    alert(`Importing ${type}... (Demo mode)\nSupported format: CSV`);
  };

  const handleExport = (type: string) => {
    alert(`Exporting ${type}... (Demo mode)\nDownloading CSV file...`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bulk Operations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Import Data</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleImport('users')}
              className="w-full flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Import Users</p>
                  <p className="text-sm text-gray-500">Upload CSV file</p>
                </div>
              </div>
              <Upload className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => handleImport('courses')}
              className="w-full flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Import Courses</p>
                  <p className="text-sm text-gray-500">Upload CSV file</p>
                </div>
              </div>
              <Upload className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Export Data</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleExport('users')}
              className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Export All Users</p>
                  <p className="text-sm text-gray-500">Download as CSV</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-green-600" />
            </button>

            <button
              onClick={() => handleExport('analytics')}
              className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Export Analytics</p>
                  <p className="text-sm text-gray-500">Download reports</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>

      {/* CSV Template */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">CSV Template Format</h3>
        <div className="text-sm text-blue-800 font-mono">
          <p className="mb-1">Users: name, email, role, date_joined</p>
          <p>Courses: title, description, level, price</p>
        </div>
      </div>
    </div>
  );
};

