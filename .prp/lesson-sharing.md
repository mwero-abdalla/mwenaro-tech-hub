# Course Lesson Sharing Implementation Plan

## Overview
Currently, the Academy database schema links lessons to courses via a strict one-to-many relationship: the `lessons` table has a hardcoded `course_id` column. This means a single lesson cannot belong to more than one course. 

To enable "Course Lesson Sharing" where one lesson (e.g., "Intro to React") can be placed into both a "Frontend Basics" course and a "Fullstack Developer" course, we must migrate to a **many-to-many relationship** using a join table.

## 1. Database Schema Changes (Supabase)

We need to decouple the lesson from the course and introduce a new linking table.

### Step 1A: Create `course_lessons` Join Table
Create a new table designed strictly to map `lessons` to `courses` and handle their ordering within that specific course.

```sql
CREATE TABLE public.course_lessons (
    course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
    order_index integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (course_id, lesson_id)
);
```

### Step 1B: Data Migration (Preserving Current Content)
Before dropping the `course_id` column from the `lessons` table, we must migrate the existing data into the new join table so no content is lost.

```sql
INSERT INTO public.course_lessons (course_id, lesson_id, order_index)
SELECT course_id, id, order_index
FROM public.lessons
WHERE course_id IS NOT NULL;
```

### Step 1C: Schema Cleanup
Once data is safely migrated, we remove the direct linking columns from the `lessons` table.
```sql
ALTER TABLE public.lessons 
DROP COLUMN course_id,
DROP COLUMN order_index;
```

## 2. API & Backend Updates (`src/lib/*.ts`)

Because the schema changed, any API function fetching lessons by course must be updated to JOIN through the new table.

### `src/lib/lessons.ts` updates:
**Modify `getCourseLessons(courseId)`**
Currently: `supabase.from('lessons').eq('course_id', courseId).order('order_index')`
New Implementation:
```javascript
const { data, error } = await supabase
    .from('course_lessons')
    .select(`
        order_index,
        lessons (*)
    `)
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

// We then map the returned data to flatten it back into a standard Lesson array
```

## 3. Form & Admin UI Updates (`src/app/admin/courses/[id]/page.tsx` & components)

The hardest part will be updating the user interface where course creators add lessons.

### 3A. Creating / Editing Lessons
Instead of an "Add Lesson" button that just creates a new record inside the course boundary, it needs to be an "**Add Content**" flow:
1.  **Option A**: "Create New Lesson" -> Creates a record in `lessons`, then immediately links it in `course_lessons`.
2.  **Option B**: "Select Existing Lesson" -> Opens a Modal/Combobox listing all lessons in the DB. When selected, it creates a link in `course_lessons`.

### 3B. Reordering
The Drag-and-Drop functionality must now update the `order_index` on the `course_lessons` table, NOT the `lessons` table.

## User Action Required
> [!IMPORTANT]
> The database migration (Step 1) is a **breaking change**. Once executed, the current frontend API will fail until Step 2 is deployed. 
> Please review this architecture plan. If you approve of the schema structure and the way existing lessons will be migrated to the new join table, let me know to proceed with executing the SQL migration.
