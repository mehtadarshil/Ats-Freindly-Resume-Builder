-- Create a storage bucket for resume uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume-uploads', 'resume-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the resume-uploads bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload resumes"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resume-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own uploads
CREATE POLICY "Allow users to read their own resume uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resume-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow service role to access all files (for the edge function)
CREATE POLICY "Allow service role to access all resume uploads"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resume-uploads');
