
-- Add RLS policies for course management by admin users
-- First, let's add policies that allow authenticated users to manage courses
-- (In a production environment, you'd want to add admin role checking)

-- Allow authenticated users to view all courses (admin access)
CREATE POLICY "Authenticated users can view all courses"
  ON public.courses FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert courses (admin access)
CREATE POLICY "Authenticated users can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update courses (admin access)
CREATE POLICY "Authenticated users can update courses"
  ON public.courses FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete courses (admin access)
CREATE POLICY "Authenticated users can delete courses"
  ON public.courses FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add similar policies for course categories
CREATE POLICY "Authenticated users can view all categories"
  ON public.course_categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories"
  ON public.course_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Add similar policies for instructors
CREATE POLICY "Authenticated users can view all instructors"
  ON public.instructors FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage instructors"
  ON public.instructors FOR ALL
  USING (auth.role() = 'authenticated');

-- Add policies for course modules
CREATE POLICY "Authenticated users can view all modules"
  ON public.course_modules FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage modules"
  ON public.course_modules FOR ALL
  USING (auth.role() = 'authenticated');
