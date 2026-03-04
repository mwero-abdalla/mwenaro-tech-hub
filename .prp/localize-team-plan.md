# Localize Team Personas Implementation Plan

The objective is to update the Mwenaro Academy team members on the About page to have Kenyan names, representative images, and contextually relevant bios.

## Proposed Changes

### Academy Package

#### [MODIFY] [page.tsx](file:///home/mwero/mwenaro-tech-academy/academy/src/app/about/page.tsx)
-   Update `team` array (excluding Mwero Abdalla):
    -   **Sarah Chen** (Head of Curriculum) -> **Faith Mutua** (Head of Curriculum).
        -   Image: `faith_mutua_headshot_1772649606819.png`
    -   **David Okonkwo** (Lead Instructor) -> **John Otieno** (Lead Instructor).
        -   Image: `john_otieno_headshot_1772649922414.png`
    -   **Emily Martinez** (Student Success Manager) -> **Brenda Njeri** (Student Success Manager).
        -   Image: `brenda_njeri_headshot_1772649940712.png`

## Verification Plan

### Manual Verification
-   Navigate to `http://localhost:3001/about` and verify:
    -   The team gallery displays the new Kenyan personas correctly.
    -   Names, roles, and bios are consistent with the new personas.
    -   Images load correctly and look professional.
