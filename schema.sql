-- Create courses table
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert dummy data
insert into courses (title, description, price, image_url) values
('Intro to React', 'Learn the basics of React from scratch.', 49.99, 'https://placehold.co/600x400/png'),
('Advanced Next.js', 'Master Server Components, Server Actions, and more.', 79.99, 'https://placehold.co/600x400/png'),
('Fullstack Supabase', 'Build production-grade apps with Supabase.', 59.99, 'https://placehold.co/600x400/png');

-- Create enrollments table
create table if not exists enrollments (
  user_id uuid references auth.users not null,
  course_id uuid references courses(id) not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, course_id)
);
