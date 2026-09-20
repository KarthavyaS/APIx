/// <reference types="vite/client" />

// API & Application Configuration for Production and Local Environments
export const BACKEND_DEPLOYED_URL = 'https://apix-backend-vusx.onrender.com';
export const FRONTEND_DEPLOYED_URL = 'https://apix-frontend-2yuo.onrender.com';

// If VITE_API_URL is explicitly set, use it;
// Otherwise in production fallback to the deployed backend URL;
// In local dev, empty string allows proxying via Vite/Express.
export const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  ((typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD) ? BACKEND_DEPLOYED_URL : '');
