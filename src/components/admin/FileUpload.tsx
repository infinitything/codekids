/**
 * File Upload Component - Drag & drop file upload with progress
 */

import { useState, useCallback } from 'react';
import { Upload, X, FileVideo, FileText, Image, CheckCircle, Loader2 } from 'lucide-react';
import { storageService, FileType, UploadResult } from '../../services/storage.service';
import { env } from '../../lib/env';

interface FileUploadProps {
  type: FileType;
  folder?: string;
  onUploadComplete: (result: UploadResult) => void;
  maxFiles?: number;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  folder,
  onUploadComplete,
  maxFiles = 1,
  accept,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [results, setResults] = useState<{ [key: string]: UploadResult }>({});
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setFiles(droppedFiles);
    },
    [maxFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setFiles(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const newResults: { [key: string]: UploadResult } = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress((prev) => ({ ...prev, [file.name]: 0 }));

      // Demo mode - simulate upload
      if (env.demoMode) {
        // Simulate upload progress
        for (let p = 0; p <= 100; p += 25) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProgress((prev) => ({ ...prev, [file.name]: p }));
        }

        // Mock success result
        const result: UploadResult = {
          success: true,
          url: URL.createObjectURL(file), // Create a local URL for preview
          path: `demo/${type}/${file.name}`,
        };

        newResults[file.name] = result;
        setResults((prev) => ({ ...prev, [file.name]: result }));
        onUploadComplete(result);
        continue;
      }

      // Production mode - real upload
      const result = await storageService.uploadFile(
        file,
        type,
        folder,
        (prog) => {
          setProgress((prev) => ({ ...prev, [file.name]: prog.percentage }));
        }
      );

      newResults[file.name] = result;
      setResults((prev) => ({ ...prev, [file.name]: result }));

      if (result.success) {
        onUploadComplete(result);
      }
    }

    setUploading(false);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) {
      return <FileVideo className="w-6 h-6 text-blue-500" />;
    }
    if (['pdf', 'doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-6 h-6 text-green-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag & drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {maxFiles > 1 ? `Up to ${maxFiles} files` : 'Single file'} •{' '}
          {type === 'video' ? 'MP4, WebM, MOV' : type === 'pdf' ? 'PDF only' : 'PDF, DOC, DOCX, Images'}
        </p>
        <input
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Select Files
        </label>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Selected Files:</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {uploading && progress[file.name] !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress[file.name]}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {progress[file.name].toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {results[file.name]?.success && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Uploaded successfully!
                    </p>
                  )}
                  {results[file.name]?.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {results[file.name].error}
                    </p>
                  )}
                </div>
              </div>
              {!uploading && !results[file.name] && (
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
              {results[file.name]?.success && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && !Object.keys(results).length && (
        <button
          onClick={uploadFiles}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload {files.length} {files.length > 1 ? 'Files' : 'File'}
        </button>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Uploading...</span>
        </div>
      )}
    </div>
  );
};

