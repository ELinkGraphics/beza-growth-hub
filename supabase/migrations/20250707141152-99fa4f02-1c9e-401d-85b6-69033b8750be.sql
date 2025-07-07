-- Fix course ID consistency by creating new columns and migrating data

-- Step 1: Create new UUID columns
ALTER TABLE course_enrollments ADD COLUMN course_id_new UUID;
ALTER TABLE course_content ADD COLUMN course_id_new UUID;

-- Step 2: Migrate data to new columns
UPDATE course_enrollments SET course_id_new = course_id::UUID;
UPDATE course_content SET course_id_new = course_id::UUID;

-- Step 3: Drop old columns and rename new ones
ALTER TABLE course_enrollments DROP COLUMN course_id;
ALTER TABLE course_enrollments RENAME COLUMN course_id_new TO course_id;

ALTER TABLE course_content DROP COLUMN course_id;
ALTER TABLE course_content RENAME COLUMN course_id_new TO course_id;

-- Step 4: Set NOT NULL constraints
ALTER TABLE course_enrollments ALTER COLUMN course_id SET NOT NULL;
ALTER TABLE course_content ALTER COLUMN course_id SET NOT NULL;

-- Step 5: Add foreign key constraints for data integrity
ALTER TABLE course_enrollments 
ADD CONSTRAINT fk_course_enrollments_course_id 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE course_content
ADD CONSTRAINT fk_course_content_course_id
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;