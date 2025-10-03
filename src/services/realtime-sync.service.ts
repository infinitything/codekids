/**
 * Real-time Sync Service - Optimistic updates with Supabase realtime
 */

import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type SyncCallback<T> = (data: T) => void;
type ErrorCallback = (error: Error) => void;

/**
 * Real-time Progress Sync
 */
export class RealtimeSyncService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private optimisticUpdates: Map<string, any> = new Map();

  /**
   * Subscribe to lesson progress updates
   */
  subscribeLessonProgress(
    studentId: string,
    onUpdate: SyncCallback<any>,
    onError?: ErrorCallback
  ): () => void {
    const channelName = `lesson-progress-${studentId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_progress',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log('Lesson progress update:', payload);
          onUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${channelName}`);
          onError?.(new Error('Subscription failed'));
        }
      });

    this.channels.set(channelName, channel);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(channelName);
    };
  }

  /**
   * Subscribe to badge updates
   */
  subscribeBadgeUpdates(
    studentId: string,
    onUpdate: SyncCallback<any>,
    onError?: ErrorCallback
  ): () => void {
    const channelName = `badges-${studentId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_badges',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log('Badge earned:', payload);
          onUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${channelName}`);
          onError?.(new Error('Subscription failed'));
        }
      });

    this.channels.set(channelName, channel);

    return () => {
      this.unsubscribe(channelName);
    };
  }

  /**
   * Subscribe to AI mentor conversation updates
   */
  subscribeAIMentorConversation(
    conversationId: string,
    onUpdate: SyncCallback<any>,
    onError?: ErrorCallback
  ): () => void {
    const channelName = `ai-conversation-${conversationId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_mentor_conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('AI conversation update:', payload);
          onUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${channelName}`);
          onError?.(new Error('Subscription failed'));
        }
      });

    this.channels.set(channelName, channel);

    return () => {
      this.unsubscribe(channelName);
    };
  }

  /**
   * Optimistic update - Apply change immediately, sync with server
   */
  async optimisticUpdate<T>(
    key: string,
    optimisticValue: T,
    serverUpdateFn: () => Promise<T>
  ): Promise<T> {
    // Store optimistic value
    this.optimisticUpdates.set(key, optimisticValue);

    try {
      // Perform server update
      const serverValue = await serverUpdateFn();

      // Replace optimistic with server value
      this.optimisticUpdates.set(key, serverValue);

      return serverValue;
    } catch (error) {
      // Rollback optimistic update on error
      this.optimisticUpdates.delete(key);
      throw error;
    }
  }

  /**
   * Get value with optimistic updates applied
   */
  getOptimisticValue<T>(key: string, serverValue: T): T {
    return this.optimisticUpdates.get(key) || serverValue;
  }

  /**
   * Clear optimistic update
   */
  clearOptimisticUpdate(key: string): void {
    this.optimisticUpdates.delete(key);
  }

  /**
   * Unsubscribe from channel
   */
  private async unsubscribe(channelName: string): Promise<void> {
    const channel = this.channels.get(channelName);
    if (channel) {
      await supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`🔌 Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  async unsubscribeAll(): Promise<void> {
    const promises = Array.from(this.channels.keys()).map((channelName) =>
      this.unsubscribe(channelName)
    );
    await Promise.all(promises);
    this.optimisticUpdates.clear();
  }

  /**
   * Check if subscription is active
   */
  isSubscribed(channelName: string): boolean {
    return this.channels.has(channelName);
  }

  /**
   * Get active subscriptions count
   */
  getActiveSubscriptionsCount(): number {
    return this.channels.size;
  }
}

/**
 * Offline Queue - Queue actions when offline
 */
export class OfflineQueue {
  private queue: Array<{
    id: string;
    action: () => Promise<any>;
    timestamp: number;
  }> = [];
  private isProcessing = false;

  /**
   * Add action to queue
   */
  enqueue(id: string, action: () => Promise<any>): void {
    this.queue.push({
      id,
      action,
      timestamp: Date.now(),
    });

    // Try to process if online
    if (navigator.onLine) {
      this.process();
    }
  }

  /**
   * Process queued actions
   */
  async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0 && navigator.onLine) {
      const item = this.queue[0];

      try {
        await item.action();
        this.queue.shift(); // Remove from queue on success
        console.log(`✅ Processed queued action: ${item.id}`);
      } catch (error) {
        console.error(`❌ Failed to process queued action: ${item.id}`, error);
        break; // Stop processing on error
      }
    }

    this.isProcessing = false;
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Initialize online/offline listeners
   */
  init(): () => void {
    const handleOnline = () => {
      console.log('🌐 Back online - processing queue');
      this.process();
    };

    const handleOffline = () => {
      console.log('📡 Offline - actions will be queued');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

// Export singleton instances
export const realtimeSyncService = new RealtimeSyncService();
export const offlineQueue = new OfflineQueue();

