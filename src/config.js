// Default backend API URL. Change if your backend runs on a different host/port.
// Avoid directly referencing `process` in browser runtime. Support build-time envs
// and a runtime override `window.__env && window.__env.REACT_APP_API_BASE_URL`.
const buildTimeUrl = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ? process.env.REACT_APP_API_BASE_URL : undefined;
const runtimeUrl = (typeof window !== 'undefined' && window.__env && window.__env.REACT_APP_API_BASE_URL) ? window.__env.REACT_APP_API_BASE_URL : undefined;
export const API_BASE_URL = buildTimeUrl || runtimeUrl || 'https://db-74vi.onrender.com';
