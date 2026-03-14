import { environment } from '../config/environment';

/**
 * Formats a product or user image URL to be absolute.
 * If the URL is already absolute (starts with http/https), it returns it as is.
 * Otherwise, it prepends the backend API host.
 */
export const formatImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  // Remove /api from end of apiUrl if present to get the base host
  const baseHost = environment.apiUrl.replace(/\/api$/, '');
  
  // Ensure the separator is handled correctly
  const path = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseHost}${path}`;
};
