/**
 * Client-Side Environment Configuration
 * Strictly exposes non-sensitive environment parameters.
 * AI Keys and Database credentials are managed on the server backend only.
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
