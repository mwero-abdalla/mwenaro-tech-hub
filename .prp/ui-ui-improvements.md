# Mwenaro Ecosystem UI/UX Improvement Plan

This document outlines the strategy for a deep UI/UX audit and enhancement across all Mwenaro applications (Academy, Hub, Talent, Labs). The goal is to achieve a premium, professional, and accessible user experience with excellent contrast, generous negative space, and refined typography.

## 1. Global Design System & Tokens
- **Typography**: Ensure a modern, readable font (e.g., Inter, Outfit, or Plus Jakarta Sans) is used consistently. Establish a strict typographic scale.
- **Color & Contrast**: 
  - Audit text-to-background contrast ratios, especially in Dark Mode.
  - Refine the primary brand colors to ensure they "pop" while maintaining accessibility.
  - Use subtle background colors (like `zinc-50/zinc-950`) to create depth without overwhelming the user.
- **Spacing (Negative Space)**: Standardize padding and margins. Use generous whitespace to let content breathe and guide the user's eye naturally.
- **Micro-interactions**: Review focus rings, hover states, and active states on all interactive elements to ensure they provide clear, satisfying feedback.

## 2. Shared Components (`packages/ui`)
- **Buttons**: Ensure consistent height, padding, border-radius, and clear hierarchy (primary, secondary, outline, ghost).
- **Cards**: Standardize shadows, border radii (e.g., `rounded-2xl` or `rounded-3xl`), and borders to create a soft, premium feel.
- **Forms & Inputs**: Improve the clarity of labels, placeholders, and error states. Ensure inputs have sufficient contrast and clear focus states.

## 3. Application-Specific Audits

### 3.1 Mwenaro Academy (Learning Platform)
- **Student Dashboard**: Ensure stats cards, course progress, and upcoming sessions are visually distinct and easy to scan.
- **Course Player (`/learn`)**: Maximize focus on content. Minimize distractions, ensure video players are prominent, and markdown content has perfect readability (line-height, measure/width).
- **Instructor/Admin Views**: Improve data density. Tables and lists should be clean, with clear actions.

### 3.2 Mwenaro Hub (Main Landing)
- **Hero Sections**: Ensure headline contrast against backgrounds/images is perfect. Ensure CTAs are obvious.
- **Ecosystem Navigation**: Make it seamless for users to understand the relationship between Hub, Academy, Talent, and Labs.

### 3.3 Mwenaro Talent & Labs
- **Professional Tone**: These apps target B2B clients. The UI must exude trust, professionalism, and high technical competence.
- **Data Presentation**: Talent profiles and Lab service offerings must be cleanly laid out using grids and cards.

## 4. Copywriting and Microcopy (Choice of Words)
- **Clarity over Cleverness**: Ensure all CTAs describe exactly what will happen (e.g., "Start Learning" instead of "Go").
- **Empty States**: Replace generic "No data" with helpful, encouraging copy (e.g., "You haven't enrolled in any courses yet. Explore our catalog to get started.").
- **Error Messages**: Ensure they are polite, explain what went wrong, and offer a solution.

## 5. Execution Phases
1. **Phase 1: Foundation**: Update shared components in `packages/ui` and global CSS/Tailwind configs.
2. **Phase 2: Core Platform**: Refine Mwenaro Academy (Dashboard, Course Player, Instructor UI).
3. **Phase 3: Landing & Marketing**: Refine Hub, Talent, and Labs pages.
4. **Phase 4: Copy & Polish**: <ctrl61>A final pass focused stringently on text, contrast, and micro-interactions.

---
*Awaiting review to proceed with Phase 1 (Foundation).*
