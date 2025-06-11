// Utility for handling standardized API responses from emoji API endpoints
/**
 * Handles a standardized API response of shape { success: boolean, data?: any, error?: string }
 * @param data The parsed JSON response from the API
 * @returns { success: boolean, data?: any, error?: string }
 */
export function handleApiResponse(data: any): { success: boolean, data?: any, error?: string } {
  if (!data || typeof data.success !== 'boolean') {
    return { success: false, error: 'Invalid server response' };
  }
  if (!data.success) {
    return { success: false, error: data.error || 'Unknown error' };
  }
  return { success: true, data: data.data };
} 