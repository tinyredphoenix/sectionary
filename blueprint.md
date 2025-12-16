# Project Blueprint

## Overview
**Sectionify** is a premium, minimalist React application designed to navigate Indian Income Tax and GST laws. The goal is to provide a clean, high-end user experience with real-time search capabilities and detailed section views.

## Project Outline
### Initial State
The project is a basic React application initialized with Vite and TypeScript.

### Implemented Features
*   **Project Structure:** Initial setup with `blueprint.md`.
*   **Core UI:** Implemented Landing page, Search, and Section Details.
*   **Mock Data:** Created `src/lib/mockData.ts`.
*   **Firebase Integration:** Search logic updated to query Firestore directly using parallel queries for better search coverage.

## Current Plan
### Objective
Refine the Firestore search logic to be more robust by running parallel queries against `section_index` and merging the results.

### Steps
1.  **Search Logic Update (Completed):**
    *   Modified `src/App.tsx` to run three parallel Firestore queries:
        *   `Query A`: `sectionNumberSearch` array-contains `userInput`
        *   `Query B`: `searchTerms` array-contains `userInput`
        *   `Query C`: `sectionTitle` range query (>= `userInput` AND <= `userInput + '\uf8ff'`)
    *   Merged results on the client side, removing duplicates by document ID.
    *   Limited final results to 10 items.
    *   Ensured all user input is lowercased before querying.

## Clarifications and Limitations
*   **External PDF Analysis:** I cannot directly analyze the content of external PDF documents from provided URLs.
*   **Firebase Database Population:** I will use mock data for now as requested, until the database is populated.
