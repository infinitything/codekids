import { supabase } from '../lib/supabase'

export interface TrackSummary {
  id: string
  title: string
  description?: string
  age_group?: string
  difficulty_level?: string
  thumbnail_url?: string
  color_theme?: string
  first_lesson_id?: string | null
  lessons_count?: number
}

export interface DbLesson {
  id: string
  track_id: string
  title: string
  description?: string
  lesson_type?: any
  difficulty_level?: any
  sequence_order?: number
  estimated_minutes?: number
  content_blocks?: any
  video_url?: string | null
  xp_reward?: number
  active?: boolean
}

class ContentService {
  async getActiveTracks(): Promise<TrackSummary[]> {
    const { data, error } = await supabase
      .from('learning_tracks')
      .select('id, title, description, age_group, difficulty_level, thumbnail_url, color_theme')
      .eq('active', true)
      .order('sequence_order', { ascending: true })

    if (error) {
      console.error('getActiveTracks error', error)
      return []
    }

    const tracks: TrackSummary[] = []
    for (const t of data || []) {
      const { data: firstLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('track_id', t.id)
        .eq('active', true)
        .order('sequence_order', { ascending: true })
        .limit(1)
        .single()

      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('track_id', t.id)
        .eq('active', true)

      tracks.push({
        id: t.id,
        title: t.title,
        description: t.description || undefined,
        age_group: t.age_group as any,
        difficulty_level: t.difficulty_level as any,
        thumbnail_url: t.thumbnail_url || undefined,
        color_theme: t.color_theme || undefined,
        first_lesson_id: firstLesson?.id || null,
        lessons_count: lessonsCount || 0,
      })
    }

    return tracks
  }

  async getLessonById(lessonId: string): Promise<DbLesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .eq('active', true)
      .single()

    if (error) {
      console.warn('getLessonById error', error)
      return null
    }
    return data as unknown as DbLesson
  }

  async getLatestLessons(limit = 12): Promise<DbLesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('getLatestLessons error', error)
      return []
    }
    return (data || []) as unknown as DbLesson[]
  }
}

export const contentService = new ContentService()


