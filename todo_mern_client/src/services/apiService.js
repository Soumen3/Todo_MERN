// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// API service class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get authentication token from localStorage
  getToken() {
    const user = localStorage.getItem('todoUser')
    if (user) {
      const userData = JSON.parse(user)
      return userData.token
    }
    return null
  }

  // Create request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle different response types
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.handleAuthError()
          throw new Error('Authentication failed. Please login again.')
        }
        
        // Handle other HTTP errors
        const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Handle authentication errors
  handleAuthError() {
    localStorage.removeItem('todoUser')
    window.dispatchEvent(new Event('userStateChange'))
    // Redirect to login page if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    })
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

// Create and export a singleton instance
export const apiService = new ApiService()
export default apiService
