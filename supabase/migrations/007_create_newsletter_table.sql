-- =====================================================
-- MIGRATION 007: Newsletter Subscribers Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can subscribe)
CREATE POLICY "newsletter_public_insert" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "newsletter_admin_all" ON public.newsletter_subscribers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscribers(is_active) WHERE is_active = true;

COMMENT ON TABLE public.newsletter_subscribers IS 'Stores email addresses for newsletter subscriptions';

