import { environment } from '../config/environment';

/**
 * Formats a product or user image URL to be absolute.
 * If the URL is already absolute (starts with http/https), it returns it as is.
 * Otherwise, it prepends the backend API host.
 */
export const formatImageUrl = (url?: string): string => {
  if (!url) return 'https://via.placeholder.com/500x500?text=DeTodito+Product';
  if (url.startsWith('http')) return url;
  
  // Get base host (remove /api/ if at the end)
  const baseHost = environment.apiUrl.replace(/\/api\/?$/, '');
  
  // Clean product path (ensure single slash between host and path)
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseHost}${cleanPath}`;
};
