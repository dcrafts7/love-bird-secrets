
-- Create gifts table
CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  creator_name TEXT NOT NULL,
  lover_name TEXT NOT NULL,
  letter_text TEXT,
  promise_text TEXT,
  photos_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  letter_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  promise_viewed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on token for fast lookups
CREATE INDEX idx_gifts_token ON public.gifts(token);

-- Enable RLS
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (create a gift)
CREATE POLICY "Anyone can create a gift"
  ON public.gifts FOR INSERT
  WITH CHECK (true);

-- Allow reading by token (handled via edge function with service role, but allow anon select by token)
CREATE POLICY "Anyone can read gift by token"
  ON public.gifts FOR SELECT
  USING (true);

-- Allow updating viewed status
CREATE POLICY "Anyone can update gift viewed status"
  ON public.gifts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow deletion
CREATE POLICY "Anyone can delete gifts"
  ON public.gifts FOR DELETE
  USING (true);

-- Create storage bucket for gift photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-photos', 'gift-photos', true);

-- Storage policies - anyone can upload photos
CREATE POLICY "Anyone can upload gift photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gift-photos');

-- Anyone can view gift photos (public bucket)
CREATE POLICY "Anyone can view gift photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-photos');

-- Anyone can delete gift photos (for cleanup)
CREATE POLICY "Anyone can delete gift photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gift-photos');
