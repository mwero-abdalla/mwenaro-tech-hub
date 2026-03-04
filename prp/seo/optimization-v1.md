# Mwenaro Ecosystem SEO Optimization Plan (v1)

## 1. Domain Structure & Overview
- **Mwenaro Tech Hub (Main Ecosystem)**: `https://mwenaro.co.ke`
- **Mwenaro Academy**: `https://academy.mwenaro.co.ke`
- **Mwenaro Talent**: `https://talent.mwenaro.co.ke`
- **Mwenaro Labs**: `https://labs.mwenaro.co.ke`

The goal is to ensure high search engine ranking for Mwenaro in the African tech ecosystem, specifically focusing on tech education, developer hiring, tech innovation, and digital solution delivery.

## 2. Global SEO Strategy
For all applications, we will implement or update:
1. **Dynamic Metadata & `metadataBase`**: Use `new URL()` with the correct subdomains.
2. **Title Templates**: Use Next.js `%s | Mwenaro [App]` structure for rich page titles.
3. **High-Value Keywords**: Tailor keywords to the specific intent of each app (e.g., "hire developers kenya" for Talent, "coding bootcamp africa" for Academy).
4. **OpenGraph & Twitter Cards**: Ensure robust social sharing previews with absolute image URLs and descriptions.
5. **Robots & Canonical URLs**: Ensure search engines index precisely the right pages. Let's add standard `robots.txt` and `sitemap.ts` files if they don't exist, though `layout.tsx` metadata config is the priority.
6. **Semantic HTML & Accessibility**: (Implicit via UI components, but ensuring meta descriptions provide accurate context).

## 3. App-Specific Optimization Focus

### 3.1 Mwenaro Tech Hub (`mwenaro.co.ke`)
- **Focus**: Overall brand authority, tech ecosystem, innovation hub, Kenya/Africa tech network.
- **Key Target Phrases**: "Mwenaro Tech Hub", "tech innovation in Kenya", "African tech ecosystem", "tech startup builder Africa".
- **Action**: Update `hub/src/app/layout.tsx` (and inner pages like `/about`, `/contact`).

### 3.2 Mwenaro Academy (`academy.mwenaro.co.ke`)
- **Focus**: Education, upskilling, coding bootcamp, project-based learning.
- **Key Target Phrases**: "Learn coding in Kenya", "software engineering bootcamp Africa", "project-based tech education", "Mwenaro Academy".
- **Action**: Update `academy/src/app/layout.tsx`, and ensure individual course pages (if dynamically generated) use `generateMetadata`.

### 3.3 Mwenaro Talent (`talent.mwenaro.co.ke`)
- **Focus**: B2B hiring, matching vetted developers with global and local companies.
- **Key Target Phrases**: "Hire developers in Kenya", "vetted African tech talent", "hire software engineers Africa", "Mwenaro Talent".
- **Action**: Update `talent/src/app/layout.tsx`.

### 3.4 Mwenaro Labs (`labs.mwenaro.co.ke`)
- **Focus**: B2B software development, R&D, digital solutions for startups and enterprises.
- **Key Target Phrases**: "Software development agency Kenya", "custom digital solutions Africa", "Mwenaro Labs", "enterprise tech R&D".
- **Action**: Update `labs/src/app/layout.tsx`.

## 4. Execution Steps
1. **Update Root Layouts**: Modify `layout.tsx` in all 4 apps to inject high-converting, keyword-rich SEO metadata. 
2. **Update Page-Level Metadata**: Add specific `title` and `description` to key static pages (like the landing pages `page.tsx`).
3. **Verify OpenGraph Assets**: Ensure `logo-full.svg` or `og-image.jpg` is correctly referenced and exists in the `public` directories.
4. **Implementation of `sitemap.ts` and `robots.ts`**: Generate Next.js dynamic sitemaps and robots files for each subdomain to ensure proper crawling.

## 5. Review Required
User approval of this plan will allow executing the codebase scans and subsequent metadata enrichment.
