# Project Blueprint

## Overview
**Sectionify** is a premium, minimalist React application designed to navigate Indian Income Tax and GST laws. The goal is to provide a clean, high-end user experience with real-time search capabilities and detailed section views.

## Project Outline
### Initial State
The project is a basic React application initialized with Vite and TypeScript.

### Implemented Features
*   **Project Structure:** Initial setup with `blueprint.md`.

## Current Plan
### Objective
Develop the core UI of Sectionify, including the landing page with a search bar and the detailed section view with a carousel for related information.

### Steps
1.  **Setup & Configuration:**
    *   Install necessary dependencies: `react-router-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react` (icons), `framer-motion` (animations), `clsx`, `tailwind-merge`.
    *   Configure Tailwind CSS manually since the init command failed.
2.  **Routing & Navigation:**
    *   Set up `react-router-dom` in `App.tsx`.
    *   Create routes for Home (`/`) and Section Detail (`/section/:id`).
3.  **Mock Data:**
    *   Create `src/lib/mockData.ts` to simulate the Firebase database response for Income Tax and GST sections.
4.  **Components:**
    *   **Header:** Minimalist header with "Sectionify" logo.
    *   **SearchBar:** Real-time search component with animations and dropdown results using mock data.
    *   **Home Page:** Hero section containing the Header and SearchBar.
    *   **Section Detail Page:**
        *   Display Section Name and Family.
        *   Horizontal Carousel (or Tabs) for: AI Synopsis, Benchmark Info, Amendments, Circulars, Case Laws.
5.  **Styling:**
    *   Apply a premium, minimalist design using Tailwind CSS (fonts, spacing, shadows).

## Clarifications and Limitations
*   **External PDF Analysis:** I cannot directly analyze the content of external PDF documents from provided URLs.
*   **Firebase Database Population:** I will use mock data for now as requested, until the database is populated.
