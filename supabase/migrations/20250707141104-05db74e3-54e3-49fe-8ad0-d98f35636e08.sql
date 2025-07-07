-- Fix course ID consistency by updating course_enrollments and course_content to use UUID

-- Step 1: Update course_enrollments.course_id to UUID type
ALTER TABLE course_enrollments 
ALTER COLUMN course_id TYPE UUID USING course_id::UUID;

-- Step 2: Update course_content.course_id to UUID type  
ALTER TABLE course_content
ALTER COLUMN course_id TYPE UUID USING course_id::UUID;

-- Step 3: Add foreign key constraints for data integrity
ALTER TABLE course_enrollments 
ADD CONSTRAINT fk_course_enrollments_course_id 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_content
ADD CONSTRAINT fk_course_content_course_id
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Step 4: Create storage policies for file security
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', false) 
ON CONFLICT (id) DO NOTHING;

-- Secure file access policies
CREATE POLICY "Enrolled students can view course files" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'course-materials' AND 
  EXISTS (
    SELECT 1 FROM course_enrollments 
    WHERE course_enrollments.email = auth.email() 
    AND course_enrollments.course_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Authenticated users can upload course files" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'course-materials' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update course files" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'course-materials' AND 
  auth.role() = 'authenticated'
);

-- Step 5: Create quiz system tables
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 6: Create discussion forum tables
CREATE TABLE course_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id INTEGER,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES course_discussions(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Step 7: Create notes and bookmarks table
CREATE TABLE student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  note_content TEXT NOT NULL,
  timestamp_seconds INTEGER, -- For video timestamp
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE lesson_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  timestamp_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id, timestamp_seconds)
);

-- Step 8: Create certificates table
CREATE TABLE course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  issued_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz system
CREATE POLICY "Students can view quiz questions for enrolled courses" ON quiz_questions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.course_id = quiz_questions.course_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "Authenticated users can manage quiz questions" ON quiz_questions
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Students can view their own quiz attempts" ON quiz_attempts
FOR SELECT USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = quiz_attempts.enrollment_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "Students can create quiz attempts" ON quiz_attempts
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = enrollment_id AND course_enrollments.email = auth.email())
);

-- RLS Policies for discussions
CREATE POLICY "Students can view discussions for enrolled courses" ON course_discussions
FOR SELECT USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.course_id = course_discussions.course_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "Enrolled students can create discussions" ON course_discussions
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = enrollment_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "Students can view replies in discussions they can access" ON discussion_replies
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM course_discussions cd
    JOIN course_enrollments ce ON ce.course_id = cd.course_id
    WHERE cd.id = discussion_replies.discussion_id AND ce.email = auth.email()
  )
);

CREATE POLICY "Enrolled students can reply to discussions" ON discussion_replies
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = enrollment_id AND course_enrollments.email = auth.email())
);

-- RLS Policies for notes and bookmarks
CREATE POLICY "Students can manage their own notes" ON student_notes
FOR ALL USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = student_notes.enrollment_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "Students can manage their own bookmarks" ON lesson_bookmarks
FOR ALL USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = lesson_bookmarks.enrollment_id AND course_enrollments.email = auth.email())
);

-- RLS Policies for certificates
CREATE POLICY "Students can view their own certificates" ON course_certificates
FOR SELECT USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = course_certificates.enrollment_id AND course_enrollments.email = auth.email())
);

CREATE POLICY "System can create certificates" ON course_certificates
FOR INSERT WITH CHECK (true);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_discussions_updated_at BEFORE UPDATE ON course_discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_notes_updated_at BEFORE UPDATE ON student_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();