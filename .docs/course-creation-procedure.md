# Course Creation Procedure: Mwenaro Academy

This document outlines the standard operating procedure for creating and managing courses within the Mwenaro Academy platform. The system follows a hierarchical structure: **Course > Phases > Lessons > Quizzes**.

---

## 1. Hierarchy Overview

The system supports two types of course structures based on complexity:

### A. Simple / Single-Topic Courses
For courses focused on a specific skill (e.g., *TypeScript*, *Master React JS*, *Intro to Web*), we skip the Phase layer. These are considered "Phases" in themselves.
*   **Structure**: Course > Lessons > Quizzes.
*   **Implementation**: In these cases, the system uses a default "Main Content" phase behind the scenes, but the user only interacts with a flat list of lessons.

### B. Complex / Multi-Track Courses (Bootcamps)
For comprehensive programs (e.g., *MERN Full-Stack Engineering Bootcamp*), the Phase layer is mandatory to group large volumes of content.
*   **Structure**: Course > Phases > Lessons > Quizzes.
*   **Terminology Note**: In the UI and documentation, **"Phase" and "Module" are often used interchangeably**. Technically, the database object is a `Phase`.
*   **Implementation**: Content is grouped into logical modules like "Web Foundations", "Backend Engineering", etc.



---

## 2. Phase 1: Initial Course Setup

Access the **Course Management** dashboard via the Admin or Instructor portal.

### Steps:
1.  **Navigate to Admin/Instructor Dashboard -> Course Management**.
2.  **Fill the "Add New Course" Form**:
    *   **Title**: Clear, descriptive name (e.g., "Mastering Next.js 15").
    *   **Price**: Set the enrollment fee in KSh.
    *   **Category**: Choose from predefined categories like Web Development or AI.
    *   **Level**: Beginner, Intermediate, or Advanced.
    *   **Description**: A multi-line summary of what the student will achieve.
3.  **Submit**: Upon creation, the course is initiated with `is_published: false` by default.

---

## 3. Phase 2: Building the Curriculum (Phases & Lessons)

Once the course is created, click **"Manage Lessons"** on the course card to enter the **Curriculum Designer**.

### A. Creating Phases (Modules)
Courses cannot have lessons without at least one phase.
1.  Click **"Manage Phases"**.
2.  Add a Title for your phase (e.g., "Phase 1: Getting Started").
3.  Phases are ordered by an `order_index`. You can reorder them to change the curriculum flow.

### B. Adding Lessons
Lessons are the atomic units of the course.
1.  In the Curriculum Designer, select the **"New Lesson"** tab.
2.  **Phase Association**: Choose which phase this lesson belongs to.
3.  **Content**:
    *   **Video URL**: YouTube/Vimeo/Cloudinary link.
    *   **Content**: Markdown-supported text area for the lesson body.
    *   **Has Project**: Toggle this if the lesson require a repository submission.
4.  **Order Index**: Determines the lesson's position within the phase.

---

## 4. Phase 3: Assessment Design (Quizzes)

Quizzes help track student progress. A lesson is only considered "Complete" in the system after the student passes its associated quiz (if one exists).

### Adding Questions:
1.  Locate the lesson in the Curriculum Designer.
2.  Click the **"Manage Quiz"** button (Pencil/Question icon).
3.  **Question Text**: The prompt for the student.
4.  **Options**: Provide multiple-choice answers.
5.  **Correct Answer**: Select the index of the right response.
6.  **Explanation**: (Optional) Details shown after the student answers.

---

## 5. Technical Workflow Under the Hood

For technical staff, here is how the data interacts:

*   **`public.courses`**: Stores the metadata.
*   **`public.phases`**: Links to `courses.id`.
*   **`public.lessons`**: Stores content. Note: Lessons are independent and can be "shared" across multiple courses.
*   **`public.phase_lessons`**: A join table that maps `lessons.id` to `phases.id` and defines the `order_index` for that specific curriculum.
*   **`public.questions`**: Linked to `lessons.id`.

### Server Actions
Creation logic is handled by `@/lib/admin.ts`:
*   `createCourse()`: Inserts into `courses`.
*   `createPhase()`: Inserts into `phases`.
*   `createLesson()`: Inserts into `lessons` AND `phase_lessons` simultaneously.

---

## 6. Access Control & Publishing

*   **Draft Mode**: New courses are draft by default. Use the **Publish Toggle** on the main dashboard to make it visible to students.
*   **Permissions**: 
    *   **Admins** can manage all courses.
    *   **Instructors** can only manage courses where their `instructor_id` matches the course record.

---

## 7. Example Creation: "TypeScript for React Developers"

To demonstrate the process, here is a breakdown of a short course covering TypeScript essentials.

### Course Metadata
*   **Title**: TypeScript for React High-Performance
*   **Price**: 12,500 KSh
*   **Level**: Intermediate
*   **Description**: Master the art of type-safe React development. From complex prop typing to advanced generics and utility types.

### Phase 1: Core Fundamentals
#### Lesson 1: Static Typing & Component Props
**Content Preview:**
```markdown
# Component Prop Typing

In React, types ensure that your components receive the correct data shapes. Avoid `any` at all costs.

### Best Practice: Interface for Props
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary'; // Union types for strict values
  disabled?: boolean;
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return <button onClick={onClick} className={variant}>{label}</button>;
};
```
```

### Phase 2: Advanced Patterns
#### Lesson 2: Generics & Utility Types
**Content Preview:**
```markdown
# Unlocking Generics

Generics allow you to create reusable components that work with a variety of types while maintaining safety.

### Generic List Component
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

### Utility Types (Pick, Omit, Partial)
Use `Omit` to create variations of existing types:
```typescript
type User = { id: string; name: string; email: string; role: string };
type UserSignup = Omit<User, 'id' | 'role'>; // Removes id and role
```
```

#### Lesson 3: Strict Configuration Discipline
**Content Preview:**
```markdown
# The tsconfig.json Discipline

To get the full benefit of TypeScript, you must enable strict mode. This prevents silent failures and "undefined is not a function" errors.

### Recommended Strict Settings:
```json
{
  "compilerOptions": {
    "strict": true,                // Enables all strict checks
    "noImplicitAny": true,         // Forces explicit types
    "strictNullChecks": true,      // "null" and "undefined" are checked
    "noUnusedLocals": true,        // Clean code enforcement
    "exactOptionalPropertyTypes": true
  }
}
```
```

### Assessment (Quiz Example)
**Lesson**: Strict Configuration Discipline
1.  **Question**: Which setting in `tsconfig.json` ensures that `null` and `undefined` are treated as distinct types?
    *   `noImplicitAny`
    *   `strictNullChecks` (Correct)
    *   `noUnusedLocals`
2.  **Question**: How do you define a prop that can only be "small", "medium", or "large"?
    *   `size: string`
    *   `size: 'small' | 'medium' | 'large'` (Correct)
    *   `size: any`

