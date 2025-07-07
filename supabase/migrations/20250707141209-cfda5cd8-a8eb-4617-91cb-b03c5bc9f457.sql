-- Fix course ID consistency by handling dependencies

-- Step 1: Drop dependent policies
DROP POLICY IF EXISTS "Enrolled users can view course content" ON course_content;

-- Step 2: Create new UUID columns
ALTER TABLE course_enrollments ADD COLUMN course_id_new UUID;
ALTER TABLE course_content ADD COLUMN course_id_new UUID;

-- Step 3: Migrate data to new columns
UPDATE course_enrollments SET course_id_new = course_id::UUID;
UPDATE course_content SET course_id_new = course_id::UUID;

-- Step 4: Drop old columns and rename new ones
ALTER TABLE course_enrollments DROP COLUMN course_id;
ALTER TABLE course_enrollments RENAME COLUMN course_id_new TO course_id;

ALTER TABLE course_content DROP COLUMN course_id;
ALTER TABLE course_content RENAME COLUMN course_id_new TO course_id;

-- Step 5: Set NOT NULL constraints
ALTER TABLE course_enrollments ALTER COLUMN course_id SET NOT NULL;
ALTER TABLE course_content ALTER COLUMN course_id SET NOT NULL;

-- Step 6: Add foreign key constraints for data integrity
ALTER TABLE course_enrollments 
ADD CONSTRAINT fk_course_enrollments_course_id 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_content
ADD CONSTRAINT fk_course_content_course_id
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Step 7: Recreate the policy with proper typing
CREATE POLICY "Enrolled users can view course content" ON course_content
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM course_enrollments 
    WHERE course_enrollments.course_id = course_content.course_id 
    AND course_enrollments.email = auth.email()
  )
);