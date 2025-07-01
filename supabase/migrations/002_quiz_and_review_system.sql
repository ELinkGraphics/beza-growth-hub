
-- Create proper quiz system tables
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_threshold INTEGER DEFAULT 70,
  max_attempts INTEGER DEFAULT 3,
  time_limit INTEGER, -- in minutes, NULL for unlimited
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
  options JSONB, -- For multiple choice options
  correct_answer TEXT NOT NULL,
  explanation TEXT,
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
  completed_at TIMESTAMPTZ,
  attempt_number INTEGER NOT NULL DEFAULT 1
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, enrollment_id) -- One review per student per course
);

-- Create storage bucket for course files
INSERT INTO storage.buckets (id, name, public) VALUES ('course-files', 'course-files', true);

-- Create storage bucket for user avatars  
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Enable RLS on new tables
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Quiz RLS policies
CREATE POLICY "Anyone can view published quizzes"
  ON public.quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = quizzes.course_id 
      AND courses.is_published = true
    )
  );

-- Quiz questions RLS policies
CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      JOIN public.courses ON courses.id = quizzes.course_id
      WHERE quizzes.id = quiz_questions.quiz_id
      AND courses.is_published = true
    )
  );

-- Quiz attempts RLS policies
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = quiz_attempts.enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Course reviews RLS policies
CREATE POLICY "Anyone can view published course reviews"
  ON public.course_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_reviews.course_id
      AND courses.is_published = true
    )
  );

CREATE POLICY "Users can insert their own course reviews"
  ON public.course_reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

CREATE POLICY "Users can update their own course reviews"
  ON public.course_reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.course_enrollments
      WHERE course_enrollments.id = course_reviews.enrollment_id
      AND course_enrollments.email = auth.email()
    )
  );

-- Storage policies for course files
CREATE POLICY "Anyone can view course files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-files');

CREATE POLICY "Authenticated users can upload course files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'course-files' AND auth.role() = 'authenticated');

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
