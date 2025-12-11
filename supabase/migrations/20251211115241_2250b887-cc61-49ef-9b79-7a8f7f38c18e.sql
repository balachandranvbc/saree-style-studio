-- Create enum for draping styles
CREATE TYPE draping_style AS ENUM (
  'bengali',
  'gujarati',
  'tamil_nadu',
  'kerala',
  'modern_lehenga',
  'nivi',
  'maharashtrian'
);

-- Create enum for fabric types
CREATE TYPE fabric_type AS ENUM (
  'silk',
  'cotton',
  'organza',
  'georgette',
  'chiffon',
  'banarasi',
  'kanjivaram',
  'chanderi'
);

-- Create enum for processing status
CREATE TYPE processing_status AS ENUM (
  'pending',
  'analyzing',
  'generating_avatar',
  'draping',
  'rendering',
  'completed',
  'failed'
);

-- Sarees catalog table
CREATE TABLE public.sarees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fabric fabric_type NOT NULL DEFAULT 'silk',
  color TEXT NOT NULL,
  secondary_color TEXT,
  border_style TEXT,
  pattern TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  texture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Draping styles reference table
CREATE TABLE public.draping_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  style draping_style NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  instructions TEXT,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles for authenticated users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  body_measurements JSONB,
  preferred_draping_style draping_style,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Try-on sessions table
CREATE TABLE public.tryon_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  original_image_url TEXT NOT NULL,
  processed_image_url TEXT,
  result_image_url TEXT,
  saree_id UUID REFERENCES public.sarees(id),
  draping_style draping_style NOT NULL DEFAULT 'nivi',
  fabric fabric_type DEFAULT 'silk',
  saree_color TEXT,
  border_style TEXT,
  pallu_length TEXT DEFAULT 'medium',
  pleat_style TEXT DEFAULT 'standard',
  body_analysis JSONB,
  pose_data JSONB,
  status processing_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sarees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draping_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tryon_sessions ENABLE ROW LEVEL SECURITY;

-- Sarees are publicly readable
CREATE POLICY "Sarees are viewable by everyone" ON public.sarees
  FOR SELECT USING (is_active = true);

-- Draping styles are publicly readable
CREATE POLICY "Draping styles are viewable by everyone" ON public.draping_styles
  FOR SELECT USING (is_active = true);

-- Users can view and update their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Try-on sessions: users can manage their own, guests can manage via session token
CREATE POLICY "Users can view their own sessions" ON public.tryon_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create sessions" ON public.tryon_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own sessions" ON public.tryon_sessions
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_sarees_updated_at
  BEFORE UPDATE ON public.sarees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tryon_sessions_updated_at
  BEFORE UPDATE ON public.tryon_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default draping styles
INSERT INTO public.draping_styles (style, name, description, region) VALUES
  ('nivi', 'Nivi Style', 'The most common draping style across India. Pleats are tucked at the waist and pallu draped over the left shoulder.', 'Pan-India'),
  ('bengali', 'Bengali Style', 'No pleats at the front. Saree wrapped around and pallu brought from back to front over the left shoulder with a key-hole effect.', 'West Bengal'),
  ('gujarati', 'Gujarati Style', 'Pallu is brought from back to front and draped over the right shoulder, with decorative pleats displayed at the front.', 'Gujarat'),
  ('tamil_nadu', 'Madisar/Tamil Style', 'Traditional 9-yard draping with the saree passed between legs creating a dhoti-like appearance.', 'Tamil Nadu'),
  ('kerala', 'Kerala Kasavu Style', 'Simple draping with minimal pleats, showcasing the golden border (kasavu). Often worn without a blouse traditionally.', 'Kerala'),
  ('maharashtrian', 'Nauvari Style', 'Traditional 9-yard saree draped like a dhoti, practical for movement. Worn by Maharashtrian women.', 'Maharashtra'),
  ('modern_lehenga', 'Lehenga Style', 'Modern draping where saree is pre-stitched or draped to look like a lehenga with separate skirt and dupatta effect.', 'Contemporary');

-- Insert sample sarees
INSERT INTO public.sarees (name, description, fabric, color, secondary_color, border_style, pattern, price) VALUES
  ('Royal Banarasi Silk', 'Handwoven Banarasi silk saree with intricate gold zari work', 'banarasi', '#8B0000', '#FFD700', 'heavy_zari', 'floral_butta', 25000),
  ('Kanjivaram Temple Border', 'Traditional Kanjivaram silk with temple border design', 'kanjivaram', '#006400', '#FFD700', 'temple', 'checks', 35000),
  ('Chanderi Lightweight', 'Light and airy Chanderi cotton-silk blend perfect for summer', 'chanderi', '#FFC0CB', '#FFFFFF', 'silver_zari', 'plain', 8000),
  ('Pure Georgette Flow', 'Flowing pure georgette saree ideal for parties', 'georgette', '#800080', '#C0C0C0', 'sequin', 'scattered_motifs', 12000),
  ('Cotton Handloom Daily', 'Comfortable cotton handloom for everyday wear', 'cotton', '#1E90FF', '#FFFFFF', 'simple', 'stripes', 3500),
  ('Organza Shimmer', 'Trendy organza saree with shimmer finish', 'organza', '#FFE4E1', '#FFD700', 'cutwork', 'plain', 15000);