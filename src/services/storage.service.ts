/**
 * Storage Service - Handle file uploads to Supabase Storage
 */

import { supabase } from '../lib/supabase';

export type FileType = 'video' | 'pdf' | 'image' | 'document';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class StorageService {
  private readonly buckets = {
    videos: 'course-videos',
    documents: 'course-documents',
    images: 'course-images',
    avatars: 'user-avatars',
  };

  /**
   * Initialize storage buckets (run once on setup)
   */
  async initializeBuckets(): Promise<void> {
    const bucketNames = Object.values(this.buckets);

    for (const bucket of bucketNames) {
      const { data: exists } = await supabase.storage.getBucket(bucket);

      if (!exists) {
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 524288000, // 500MB
        });
        console.log(`✅ Created bucket: ${bucket}`);
      }
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(
    file: File,
    type: FileType,
    folder?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, type);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Determine bucket
      const bucket = this.getBucketForType(type);

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = folder
        ? `${folder}/${timestamp}_${sanitizedName}`
        : `${timestamp}_${sanitizedName}`;

      // Upload with progress tracking
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return {
        success: true,
        url: urlData.publicUrl,
        path: path,
      };
    } catch (error: any) {
      console.error('Storage service error:', error);
      return { success: false, error: error.message || 'Upload failed' };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    type: FileType,
    folder?: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadFile(
        files[i],
        type,
        folder,
        (progress) => onProgress?.(i, progress)
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Delete file from storage
   */
  async deleteFile(path: string, type: FileType): Promise<boolean> {
    try {
      const bucket = this.getBucketForType(type);

      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  /**
   * Get file URL
   */
  getFileUrl(path: string, type: FileType): string {
    const bucket = this.getBucketForType(type);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * List files in folder
   */
  async listFiles(folder: string, type: FileType): Promise<any[]> {
    try {
      const bucket = this.getBucketForType(type);

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        console.error('List files error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(
    file: File,
    type: FileType
  ): { valid: boolean; error?: string } {
    // Check file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 500MB.' };
    }

    // Check file type
    const allowedTypes = this.getAllowedTypes(type);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Get bucket name for file type
   */
  private getBucketForType(type: FileType): string {
    switch (type) {
      case 'video':
        return this.buckets.videos;
      case 'image':
        return this.buckets.images;
      case 'pdf':
      case 'document':
        return this.buckets.documents;
      default:
        return this.buckets.documents;
    }
  }

  /**
   * Get allowed file extensions for type
   */
  private getAllowedTypes(type: FileType): string[] {
    switch (type) {
      case 'video':
        return ['mp4', 'webm', 'mov', 'avi', 'mkv'];
      case 'image':
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      case 'pdf':
        return ['pdf'];
      case 'document':
        return ['pdf', 'doc', 'docx', 'txt', 'md'];
      default:
        return [];
    }
  }

  /**
   * Get file type from MIME type
   */
  getFileTypeFromMime(mimeType: string): FileType {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'document';
  }
}

export const storageService = new StorageService();

