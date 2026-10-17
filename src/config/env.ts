/**
 * Client-Side Environment Configuration
 * Exposes only public browser configuration. Supabase uses its publishable key
 * in the client; service-role and AI secrets must never use VITE_ variables.
 */

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',
  isProduction: import.meta.env.PROD || false,
  defaultLocation: {
    name: 'Katraj, Pune, Maharashtra',
    lat: 18.4575,
    lng: 73.8508,
  }
};
