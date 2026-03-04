# Update Brand and Founder Information Implementation Plan

The goal is to rename "Mwero Tech Academy" to "Mwenaro Academy" and update the founder information for Mwero Abdalla across the codebase.

## Proposed Changes

### Academy Package

#### [MODIFY] [page.tsx](file:///home/mwero/mwenaro-tech-academy/academy/src/app/about/page.tsx)
-   Update `team` array:
    -   Change `Alex Mwero` to `Mwero Abdalla`.
    -   Update role to `Founder & CEO`.
    -   Update bio to `A seasoned Fullstack Developer | Tech Educator | Tech Mentor`.
-   Update Hero Section:
    -   Change `Mwero Tech Academy` to `Mwenaro Academy`.
-   Update "Our Story" section:
    -   Change `Mwero Tech Academy` to `Mwenaro Academy`.
    -   Change `Alex Mwero` to `Mwero Abdalla`.
-   Update CTA section:
    -   Change `Mwero Tech Academy` to `Mwenaro Academy`.

#### [MODIFY] [layout.tsx](file:///home/mwero/mwenaro-tech-academy/academy/src/app/layout.tsx)
-   Update Metadata:
    -   Replace all instances of `Mwenaro Tech Academy` with `Mwenaro Academy`.
    -   (Note: Some instances already use `Mwenaro Tech Academy`, I will standardize to `Mwenaro Academy` as per the request "it's not mwero tech academy, but Mwenaro Acedemy [sic]").

### Hub Package

#### [MODIFY] [layout.tsx](file:///home/mwero/mwenaro-tech-academy/hub/src/app/layout.tsx)
-   Check and update metadata similarly to Academy if "Mwero Tech Academy" is found.

### Global Search & Replace
-   Perform a final grep for `Mwero Tech Academy` and `Alex Mwero` to ensure no remnants remain.

## Verification Plan

### Manual Verification
-   Navigate to `http://localhost:3001/about` and verify:
    -   Hero text says "Mwenaro Academy".
    -   "Our Story" mentions "Mwenaro Academy" and "Mwero Abdalla".
    -   Team section shows "Mwero Abdalla" with the new bio.
-   Check page titles/metadata in browser tabs.
