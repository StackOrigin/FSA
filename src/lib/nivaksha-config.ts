/**
 * Nivaksha API Configuration
 * 
 * Base URL: https://nivaksha.me/api (production)
 * Development: http://localhost:4000/api
 * 
 * School context via query param ?school=school-id or header x-school-id
 * CORS allows localhost:3001 in development
 */

// Get environment variables with fallbacks
const getEnv = (key: string, fallback: string): string => {
  // In Vite, env variables are available via import.meta.env
  // We'll use a simple approach that works in both dev and build
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  return fallback;
};

export const NIVAKSHA_CONFIG = {
  // Base API URL - defaults to production, can be overridden via VITE_NIVAKSHA_API_URL
  baseUrl: getEnv('VITE_NIVAKSHA_API_URL', 'https://nivaksha.me/api'),
  
  // School ID - required for all API calls, can be set via VITE_SCHOOL_ID
  schoolId: getEnv('VITE_SCHOOL_ID', 'future-stars'),
  
  // Admin panel URL
  adminUrl: 'https://nivaksha.me/admin',
  
  // Default pagination
  defaultLimit: 12,
  defaultPage: 1,
  
  // Default sorting
  defaultSort: 'createdAt',
  defaultOrder: 'desc',
} as const;

/**
 * Build a full API URL for a module endpoint
 * @param module - The module name (gallery, staff, albums, notices, events, faculty, etc.)
 * @param params - Optional query parameters
 * @returns Full API URL with school context
 */
export function buildApiUrl(module: string, params: Record<string, string | number | undefined> = {}): string {
  const { baseUrl, schoolId } = NIVAKSHA_CONFIG;
  
  // Build query parameters
  const searchParams = new URLSearchParams();
  
  // Add school context (required)
  if (schoolId) {
    searchParams.set('school', schoolId);
  }
  
  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  const separator = queryString ? '?' : '';
  
  return `${baseUrl}/schools/${schoolId}/${module}${separator}${queryString}`;
}

/**
 * Build a URL for site data endpoint (aggregated home page data)
 * @param params - Optional query parameters
 * @returns Full API URL for site data
 */
export function buildSiteDataUrl(params: Record<string, string | number | undefined> = {}): string {
  const { baseUrl, schoolId } = NIVAKSHA_CONFIG;
  
  const searchParams = new URLSearchParams();
  
  if (schoolId) {
    searchParams.set('school', schoolId);
  }
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  const separator = queryString ? '?' : '';
  
  return `${baseUrl}/schools/${schoolId}/site-data${separator}${queryString}`;
}

/**
 * Build uploads URL for images/files
 * @param path - The upload path (e.g., '/uploads/images/photo.jpg')
 * @returns Full URL to the upload
 */
export function buildUploadUrl(path: string): string {
  const { baseUrl } = NIVAKSHA_CONFIG;
  // Remove /api from baseUrl to get the root domain
  const rootUrl = baseUrl.replace(/\/api$/, '');
  return `${rootUrl}${path}`;
}

export default NIVAKSHA_CONFIG;