# Blueprint

## Overview
This project is a React application set up with Vite. It has been configured to connect with Firebase, specifically Firestore.

## Project Outline
*   **React Application:** A basic React application initialized with Vite.
*   **Firebase Integration:**
    *   `src/firebase.js`: Contains the Firebase initialization code with your provided configuration and exports the Firestore database instance (`db`).
    *   `.idx/mcp.json`: Configured for Firebase MCP.
    *   `firebase` npm package: Installed as a dependency.

## Plan for Current Change: Link to Firebase Database
1.  **Create `src/firebase.js`**: A new file was created to house the Firebase configuration and initialization.
2.  **Update `.idx/mcp.json`**: The Firebase MCP configuration was added to this file to enable Firebase services within the workspace.
3.  **Install Firebase SDK**: The `firebase` npm package was installed to provide the necessary libraries for interacting with Firebase.
4.  **Import `getFirestore`**: The `getFirestore` function was imported and used to initialize the Firestore database instance.
5.  **Updated Firebase Config**: The `firebaseConfig` object in `src/firebase.js` has been updated with your provided API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID.

Now you can use the `db` object (exported from `src/firebase.js`) in your React components to interact with your Firestore database.