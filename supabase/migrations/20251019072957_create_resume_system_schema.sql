/*
  # Resume System Database Schema

  ## Overview
  This migration creates the foundational database structure for an AI-powered, auto-updating resume system
  that aggregates verified achievements from multiple platforms.

  ## New Tables

  ### 1. profiles
  User profile information and preferences
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - Full name
  - `headline` (text) - Professional headline
  - `phone` (text) - Contact phone
  - `location` (text) - Current location
  - `linkedin_url` (text) - LinkedIn profile
  - `github_url` (text) - GitHub profile
  - `portfolio_url` (text) - Personal website
  - `ai_summary` (text) - AI-generated professional summary
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. achievements
  Core table for all user achievements from integrated platforms
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `type` (text) - Achievement type: 'education', 'internship', 'project', 'course', 'hackathon', 'certification'
  - `title` (text) - Achievement title
  - `organization` (text) - Organization/institution name
  - `description` (text) - Detailed description
  - `start_date` (date) - Start date
  - `end_date` (date) - End date (null if ongoing)
  - `location` (text) - Location
  - `skills` (text[]) - Array of skills gained
  - `verification_status` (text) - Status: 'verified', 'pending', 'unverified'
  - `verification_source` (text) - Source platform that verified this
  - `external_id` (text) - ID from external platform
  - `metadata` (jsonb) - Additional flexible data
  - `is_visible` (boolean) - Whether to show on resume
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. skills
  Aggregated skills from all achievements
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `name` (text) - Skill name
  - `category` (text) - Category: 'technical', 'soft', 'language', 'tool'
  - `proficiency` (integer) - Proficiency level 1-5
  - `endorsement_count` (integer) - Number of endorsements
  - `source_achievements` (uuid[]) - IDs of achievements that contributed this skill
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. integration_connections
  Tracks connected external platforms
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `platform` (text) - Platform name: 'coursera', 'udemy', 'devfolio', 'linkedin', 'github'
  - `platform_user_id` (text) - User ID on that platform
  - `access_token` (text) - Encrypted access token
  - `refresh_token` (text) - Encrypted refresh token
  - `token_expires_at` (timestamptz) - Token expiration
  - `is_active` (boolean) - Connection status
  - `last_sync_at` (timestamptz) - Last data sync timestamp
  - `sync_frequency` (text) - Sync frequency: 'realtime', 'daily', 'weekly'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. resume_templates
  Customizable resume templates
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `name` (text) - Template name
  - `layout` (text) - Layout type: 'modern', 'classic', 'minimal', 'technical'
  - `sections_order` (text[]) - Ordered list of sections
  - `color_scheme` (jsonb) - Color configuration
  - `font_settings` (jsonb) - Font configuration
  - `is_default` (boolean) - Default template flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. sync_logs
  Audit trail for platform synchronization
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `platform` (text) - Source platform
  - `sync_status` (text) - Status: 'success', 'partial', 'failed'
  - `items_synced` (integer) - Number of items synced
  - `error_message` (text) - Error details if failed
  - `sync_duration_ms` (integer) - Sync duration in milliseconds
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated access required for all operations
  - Restrictive policies for data integrity

  ## Indexes
  - Performance indexes on foreign keys and commonly queried fields
  - Composite indexes for complex queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  headline text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  ai_summary text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('education', 'internship', 'project', 'course', 'hackathon', 'certification')),
  title text NOT NULL,
  organization text NOT NULL,
  description text DEFAULT '',
  start_date date,
  end_date date,
  location text DEFAULT '',
  skills text[] DEFAULT '{}',
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
  verification_source text DEFAULT '',
  external_id text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT 'technical' CHECK (category IN ('technical', 'soft', 'language', 'tool')),
  proficiency integer DEFAULT 3 CHECK (proficiency >= 1 AND proficiency <= 5),
  endorsement_count integer DEFAULT 0,
  source_achievements uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create integration_connections table
CREATE TABLE IF NOT EXISTS integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('coursera', 'udemy', 'devfolio', 'linkedin', 'github', 'internshala', 'unstop')),
  platform_user_id text DEFAULT '',
  access_token text DEFAULT '',
  refresh_token text DEFAULT '',
  token_expires_at timestamptz,
  is_active boolean DEFAULT true,
  last_sync_at timestamptz,
  sync_frequency text DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'daily', 'weekly', 'manual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Create resume_templates table
CREATE TABLE IF NOT EXISTS resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  layout text DEFAULT 'modern' CHECK (layout IN ('modern', 'classic', 'minimal', 'technical')),
  sections_order text[] DEFAULT '{"summary", "experience", "education", "skills", "projects"}',
  color_scheme jsonb DEFAULT '{"primary": "#2563eb", "secondary": "#64748b", "accent": "#0ea5e9"}',
  font_settings jsonb DEFAULT '{"heading": "Inter", "body": "Inter", "size": "medium"}',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  sync_status text DEFAULT 'success' CHECK (sync_status IN ('success', 'partial', 'failed')),
  items_synced integer DEFAULT 0,
  error_message text DEFAULT '',
  sync_duration_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_achievements_verification ON achievements(verification_status);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_integration_connections_user_id ON integration_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for skills
CREATE POLICY "Users can view own skills"
  ON skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for integration_connections
CREATE POLICY "Users can view own connections"
  ON integration_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON integration_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON integration_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON integration_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for resume_templates
CREATE POLICY "Users can view own templates"
  ON resume_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON resume_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON resume_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON resume_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for sync_logs
CREATE POLICY "Users can view own sync logs"
  ON sync_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync logs"
  ON sync_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_connections_updated_at BEFORE UPDATE ON integration_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_templates_updated_at BEFORE UPDATE ON resume_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();