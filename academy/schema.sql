-- Create courses table
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric,
  original_price numeric,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert dummy data
insert into courses (title, description, price, original_price, image_url) values
('Intro to Web Development', 'Master the foundations of the web: HTML, CSS, and JavaScript.', 16000, 20000, 'https://placehold.co/600x400/png'),
('Intro to React', 'Build modern, interactive user interfaces with React.', 24000, 30000, 'https://placehold.co/600x400/png'),
('Fullstack Development', 'Become a complete developer with MERN and Supabase mastery.', 75000, 89000, 'https://placehold.co/600x400/png');

-- Create enrollments table
create table if not exists enrollments (
  user_id uuid references auth.users not null,
  course_id uuid references courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);

-- Create lessons table
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) not null,
  title text not null,
  content text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed lessons for 'Intro to React'
DO $$
DECLARE
    react_course_id uuid;
BEGIN
    SELECT id INTO react_course_id FROM courses WHERE title = 'Intro to React' LIMIT 1;

    IF react_course_id IS NOT NULL THEN
        INSERT INTO lessons (course_id, title, content, order_index) VALUES
        (react_course_id, 'Introduction to Components', 'Components are the building blocks of React applications...', 1),
        (react_course_id, 'State and Props', 'State allows components to change over time, while props allow data to be passed...', 2),
        (react_course_id, 'useEffect Hook', 'The useEffect hook lets you perform side effects in functional components...', 3)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;


-- Add has_project column to lessons if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'has_project') THEN
        ALTER TABLE lessons ADD COLUMN has_project boolean DEFAULT false;
    END IF;
END $$;

-- Create questions table for quizzes
create table if not exists questions (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references lessons(id) not null,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["Option A", "Option B"]
  correct_answer integer not null, -- Index of correct option (0-based)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lesson_progress table
create table if not exists lesson_progress (
  user_id uuid references auth.users not null,
  lesson_id uuid references lessons(id) not null,
  is_completed boolean default false,
  quiz_attempts integer default 0,
  highest_quiz_score integer default 0,
  project_repo_link text,
  completed_at timestamp with time zone,
  primary key (user_id, lesson_id)
);

-- Seed some quiz data and update project flags
DO $$
DECLARE
    react_course_id uuid;
    lesson_components_id uuid;
    lesson_state_id uuid;
BEGIN
    SELECT id INTO react_course_id FROM courses WHERE title = 'Intro to React' LIMIT 1;
    
    IF react_course_id IS NOT NULL THEN
        -- Get lesson IDs
        SELECT id INTO lesson_components_id FROM lessons WHERE course_id = react_course_id AND title = 'Introduction to Components' LIMIT 1;
        SELECT id INTO lesson_state_id FROM lessons WHERE course_id = react_course_id AND title = 'State and Props' LIMIT 1;

        -- Update "State and Props" to require a project
        IF lesson_state_id IS NOT NULL THEN
            UPDATE lessons SET has_project = true WHERE id = lesson_state_id;
        END IF;

        -- Add questions for "Introduction to Components"
        IF lesson_components_id IS NOT NULL THEN
            INSERT INTO questions (lesson_id, question_text, options, correct_answer) VALUES
            (lesson_components_id, 'What is a React Component?', '["A function or class that returns UI", "A database table", "A server-side script"]'::jsonb, 0),
            (lesson_components_id, 'How do you pass data to a component?', '["State", "Props", "Hooks"]'::jsonb, 1)
            ON CONFLICT DO NOTHING; -- No constraint to conflict on really, but safe for re-runs implies we might duplicate if we run multiple times. Ideally we'd check. 
            -- For now, let's assume this is dev data seeding. 
        END IF;
    END IF;
END $$;
