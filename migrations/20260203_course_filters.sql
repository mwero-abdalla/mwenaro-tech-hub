-- Migration: Add Category and Level to Courses
-- Description: Add category and level columns to courses table for filtering
-- Created: 2026-02-03

-- Add category column
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add level column  
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);

-- Set default categories for existing courses based on title keywords
UPDATE courses SET category = 'Web Development' 
WHERE category IS NULL AND (
    title ILIKE '%web%' OR 
    title ILIKE '%html%' OR 
    title ILIKE '%css%' OR 
    title ILIKE '%javascript%' OR
    title ILIKE '%react%' OR
    title ILIKE '%next%' OR
    title ILIKE '%frontend%' OR
    title ILIKE '%backend%' OR
    title ILIKE '%node%'
);

UPDATE courses SET category = 'Data Science'
WHERE category IS NULL AND (
    title ILIKE '%data%' OR
    title ILIKE '%python%' OR
    title ILIKE '%analytics%' OR
    title ILIKE '%statistics%'
);

UPDATE courses SET category = 'Mobile Development'
WHERE category IS NULL AND (
    title ILIKE '%mobile%' OR
    title ILIKE '%android%' OR
    title ILIKE '%ios%' OR
    title ILIKE '%flutter%' OR
    title ILIKE '%react native%'
);

UPDATE courses SET category = 'Cloud Computing'
WHERE category IS NULL AND (
    title ILIKE '%cloud%' OR
    title ILIKE '%aws%' OR
    title ILIKE '%azure%' OR
    title ILIKE '%devops%' OR
    title ILIKE '%kubernetes%' OR
    title ILIKE '%docker%'
);

UPDATE courses SET category = 'Cybersecurity'
WHERE category IS NULL AND (
    title ILIKE '%security%' OR
    title ILIKE '%hacking%' OR
    title ILIKE '%cyber%'
);

UPDATE courses SET category = 'AI & Machine Learning'
WHERE category IS NULL AND (
    title ILIKE '%ai%' OR
    title ILIKE '%machine learning%' OR
    title ILIKE '%ml%' OR
    title ILIKE '%deep learning%' OR
    title ILIKE '%tensorflow%' OR
    title ILIKE '%neural%'
);

-- Set remaining courses to Web Development as default
UPDATE courses SET category = 'Web Development' WHERE category IS NULL;

-- Set level based on title keywords
UPDATE courses SET level = 'Advanced'
WHERE level IS NULL OR level = 'Beginner' AND (
    title ILIKE '%advanced%' OR
    title ILIKE '%expert%' OR
    title ILIKE '%mastery%'
);

UPDATE courses SET level = 'Intermediate'
WHERE level = 'Beginner' AND (
    title ILIKE '%intermediate%' OR
    title ILIKE '%professional%'
);

-- Add comments
COMMENT ON COLUMN courses.category IS 'Course category for filtering (Web Development, Data Science, etc.)';
COMMENT ON COLUMN courses.level IS 'Skill level: Beginner, Intermediate, or Advanced';
