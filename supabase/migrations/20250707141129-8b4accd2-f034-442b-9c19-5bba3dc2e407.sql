-- Fix course ID consistency step by step

-- Step 1: Remove the default value from course_content.course_id first
ALTER TABLE course_content ALTER COLUMN course_id DROP DEFAULT;

-- Step 2: Update course_enrollments.course_id to UUID type
ALTER TABLE course_enrollments 
ALTER COLUMN course_id TYPE UUID USING course_id::UUID;

-- Step 3: Update course_content.course_id to UUID type  
ALTER TABLE course_content
ALTER COLUMN course_id TYPE UUID USING course_id::UUID;

-- Step 4: Add foreign key constraints for data integrity
ALTER TABLE course_enrollments 
ADD CONSTRAINT fk_course_enrollments_course_id 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_content
ADD CONSTRAINT fk_course_content_course_id
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;