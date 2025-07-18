// Central export file for all API services
export { default as apiService } from './apiService'
export { default as authAPI } from './authAPI'
export { default as todoAPI } from './todoAPI'

// Error types for consistent error handling
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// HTTP status codes for reference
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

// Helper function to check if error is network related
export const isNetworkError = (error) => {
  return error.name === 'TypeError' && error.message.includes('Failed to fetch')
}

// Helper function to check if error is authentication related
export const isAuthError = (error) => {
  return error.message.includes('Authentication') || 
         error.message.includes('Unauthorized') ||
         error.message.includes('login')
}

// Helper function to format error messages for user display
export const formatErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your internet connection and try again.'
  }
  
  if (isAuthError(error)) {
    return 'Authentication failed. Please login again.'
  }
  
  // Return the original message if it's user-friendly, otherwise a generic message
  if (error.message && error.message.length < 100 && !error.message.includes('fetch')) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

// Helper function to retry API calls with exponential backoff
export const retryApiCall = async (apiFunction, maxRetries = 3, delay = 1000) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction()
    } catch (error) {
      lastError = error
      
      // Don't retry on authentication errors or client errors (4xx)
      if (isAuthError(error) || error.message.includes('400')) {
        throw error
      }
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError
}
