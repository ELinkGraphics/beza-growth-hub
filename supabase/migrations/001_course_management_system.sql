
-- Create course categories table
CREATE TABLE public.course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create instructors table
CREATE TABLE public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update courses table to support multiple courses with pricing
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT true,
  category_id UUID REFERENCES public.course_categories(id),
  instructor_id UUID REFERENCES public.instructors(id),
  cover_image_url TEXT,
  preview_video_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update course_content to reference modules
ALTER TABLE public.course_content 
ADD COLUMN module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
ADD COLUMN file_urls TEXT[],
ADD COLUMN content_type TEXT DEFAULT 'video';

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_threshold INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  template_url TEXT,
  template_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create issued certificates table
CREATE TABLE public.issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create course purchases table
CREATE TABLE public.course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create course comments table
CREATE TABLE public.course_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  parent_id UUID REFERENCES public.course_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issued_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Course categories - public read
CREATE POLICY "Anyone can view course categories"
  ON public.course_categories FOR SELECT
  USING (true);

-- Instructors - public read
CREATE POLICY "Anyone can view instructors"
  ON public.instructors FOR SELECT
  USING (true);

-- Courses - public read for published courses
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Course modules - public read for published courses
CREATE POLICY "Anyone can view modules of published courses"
  ON public.course_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = course_modules.course_id 
      AND courses.is_published = true
    )
  );

-- Course content - enrolled users can view
CREATE POLICY "Enrolled users can view course content"
  ON public.course_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.course_id = course_content.course_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Quizzes - enrolled users can view
CREATE POLICY "Enrolled users can view quizzes"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.course_id = quizzes.course_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Quiz questions - enrolled users can view
CREATE POLICY "Enrolled users can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      JOIN public.course_enrollments ON course_enrollments.course_id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Quiz attempts - users can view their own attempts
CREATE POLICY "Users can view their quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = quiz_attempts.enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Users can insert their own quiz attempts
CREATE POLICY "Users can insert their quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Course comments - users can view and insert
CREATE POLICY "Users can view course comments"
  ON public.course_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON public.course_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Course purchases - users can view their own purchases
CREATE POLICY "Users can view their purchases"
  ON public.course_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default data
INSERT INTO public.course_categories (name, description, icon) VALUES
('Personal Development', 'Courses focused on personal growth and development', 'user'),
('Business', 'Business and entrepreneurship courses', 'briefcase'),
('Technology', 'Technical and programming courses', 'code'),
('Marketing', 'Marketing and branding courses', 'trending-up');

INSERT INTO public.instructors (name, bio, email) VALUES
('Beza Haile', 'Expert in personal branding and professional development', 'beza@example.com');

-- Migrate existing course data
INSERT INTO public.courses (id, title, description, short_description, price, is_free, category_id, instructor_id, is_published)
SELECT 
  gen_random_uuid(),
  'Personal Branding Fundamentals',
  'Learn the fundamentals of personal branding and how to build your professional presence.',
  'Master personal branding basics',
  0.00,
  true,
  (SELECT id FROM public.course_categories WHERE name = 'Personal Development'),
  (SELECT id FROM public.instructors WHERE name = 'Beza Haile'),
  true;

-- Create a module for the existing course
INSERT INTO public.course_modules (course_id, title, description, order_index)
SELECT 
  courses.id,
  'Introduction to Personal Branding',
  'Foundational concepts of personal branding',
  1
FROM public.courses 
WHERE title = 'Personal Branding Fundamentals';

-- Update existing course content to reference the new course and module
UPDATE public.course_content 
SET 
  course_id = (SELECT id FROM public.courses WHERE title = 'Personal Branding Fundamentals'),
  module_id = (SELECT id FROM public.course_modules WHERE title = 'Introduction to Personal Branding')
WHERE course_id = 'personal-branding-fundamentals';

-- Update existing enrollments to reference the new course
UPDATE public.course_enrollments 
SET course_id = (SELECT id FROM public.courses WHERE title = 'Personal Branding Fundamentals')::text
WHERE course_id = 'personal-branding-fundamentals';
