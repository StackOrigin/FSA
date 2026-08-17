import { buildApiUrl, buildSiteDataUrl, buildUploadUrl, NIVAKSHA_CONFIG } from './nivaksha-config';

/**
 * Nivaksha API client helpers
 * All responses use the envelope: { ok: true, data: ... } or { ok: false, error: { code, message } }
 */

interface NivakshaResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Unwrap the Nivaksha response envelope and return just the data
 */
function unwrap<T>(res: Response, data: NivakshaResponse<T>): T {
  if (!res.ok || !data.ok) {
    const message = data.error?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data.data as T;
}

/**
 * GET a public module endpoint
 * @param module - The module name (notices, events, albums, etc.)
 * @param params - Optional query parameters
 */
export async function apiGet<T>(module: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = buildApiUrl(module, params);
  const res = await fetch(url);
  const data = await res.json() as NivakshaResponse<T>;
  return unwrap(res, data);
}

/**
 * GET site data (home page content, school info, etc.)
 */
export async function getSiteData<T>(): Promise<T> {
  const url = buildSiteDataUrl();
  const res = await fetch(url);
  const data = await res.json() as NivakshaResponse<T>;
  return unwrap(res, data);
}

/**
 * GET site data for a specific school
 */
export async function getSchoolSiteData<T>(schoolId: string = NIVAKSHA_CONFIG.schoolId): Promise<T> {
  const url = `${NIVAKSHA_CONFIG.baseUrl}/schools/${schoolId}/site-data?school=${schoolId}`;
  const res = await fetch(url);
  const data = await res.json() as NivakshaResponse<T>;
  return unwrap(res, data);
}

/**
 * POST to a public module endpoint (e.g., inquiries)
 * @param module - The module name (inquiries)
 * @param body - Request body
 */
export async function apiPost<T>(module: string, body: unknown): Promise<T> {
  const url = buildApiUrl(module);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json() as NivakshaResponse<T>;
  return unwrap(res, data);
}

/**
 * Submit a contact or admission inquiry
 */
export async function submitInquiry(body: {
  type: 'admission' | 'contact';
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  studentName?: string;
  guardianName?: string;
  grade?: string;
  previousSchool?: string;
  subject?: string;
}): Promise<{ id: string; schoolId: string; status: string; createdAt: string }> {
  return apiPost('inquiries', body);
}

/**
 * Fetch gallery images from the site-data endpoint
 * @returns Array of { src, alt, category } gallery items
 */
export async function getGalleryItems(): Promise<Array<{ src: string; alt: string; category: string }>> {
  const data = await getSchoolSiteData<any>();
  const items = data?.galleryItems ?? [];
  return Array.isArray(items) ? items : [];
}

/**
 * Fetch gallery categories from the site-data endpoint
 * @returns Array of category names
 */
export async function getGalleryCategories(): Promise<string[]> {
  const data = await getSchoolSiteData<any>();
  const categories = data?.galleryCategories ?? [];
  return Array.isArray(categories) ? categories : [];
}

/**
 * Resolve an upload path returned by the API to a full URL
 */
export function resolveUploadUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads/')) {
    return buildUploadUrl(path);
  }
  if (path.startsWith('/api/uploads/')) {
    return `${NIVAKSHA_CONFIG.baseUrl.replace(/\/api$/, '')}${path}`;
  }
  return path;
}