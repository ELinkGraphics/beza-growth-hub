-- Add RLS policies for new tables

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

CREATE POLICY "Students can update their own discussions" ON course_discussions
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE course_enrollments.id = course_discussions.enrollment_id AND course_enrollments.email = auth.email())
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

CREATE POLICY "Authenticated users can update certificates" ON course_certificates
FOR UPDATE USING (auth.role() = 'authenticated');

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