import apiService from './apiService'

// Authentication API endpoints
export const authAPI = {
  // User registration
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData)
      
      // If registration successful and returns user data with token
      if (response.user && response.token) {
        const userWithToken = { ...response.user, token: response.token }
        localStorage.setItem('todoUser', JSON.stringify(userWithToken))
        window.dispatchEvent(new Event('userStateChange'))
      }
      
      return response
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  },

  // User login
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials, { includeAuth: false })
      
      // Store user data and token in localStorage
      if (response.user && response.token) {
        const userWithToken = { ...response.user, token: response.token }
        localStorage.setItem('todoUser', JSON.stringify(userWithToken))
        window.dispatchEvent(new Event('userStateChange'))
      }
      
      return response
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  },

  // User logout
  async logout() {
    try {
      console.log('AuthAPI: Starting logout process')
    //   await apiService.post('/auth/logout')
      console.log('AuthAPI: Logout API call successful')
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error.message)
    } finally {
      // Always clear local storage and update state
      console.log('AuthAPI: Clearing localStorage and dispatching event')
      localStorage.removeItem('todoUser')
      window.dispatchEvent(new Event('userStateChange'))
      console.log('AuthAPI: Logout process completed')
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      return await apiService.get('/auth/profile')
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user profile')
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await apiService.put('/auth/profile', userData)
      
      // Update localStorage with new user data if successful
      if (response.user) {
        const currentUser = JSON.parse(localStorage.getItem('todoUser') || '{}')
        const updatedUser = { ...currentUser, ...response.user }
        localStorage.setItem('todoUser', JSON.stringify(updatedUser))
        window.dispatchEvent(new Event('userStateChange'))
      }
      
      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile')
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      return await apiService.put('/auth/change-password', passwordData)
    } catch (error) {
      throw new Error(error.message || 'Failed to change password')
    }
  },

  // Request password reset
  async requestPasswordReset(email) {
    try {
      return await apiService.post('/auth/forgot-password', { email }, { includeAuth: false })
    } catch (error) {
      throw new Error(error.message || 'Failed to request password reset')
    }
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      return await apiService.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      }, { includeAuth: false })
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password')
    }
  },

  // Verify email
  async verifyEmail(token) {
    try {
      return await apiService.post('/auth/verify-email', { token }, { includeAuth: false })
    } catch (error) {
      throw new Error(error.message || 'Email verification failed')
    }
  },

  // Resend verification email
  async resendVerification(email) {
    try {
      return await apiService.post('/auth/resend-verification', { email }, { includeAuth: false })
    } catch (error) {
      throw new Error(error.message || 'Failed to resend verification email')
    }
  }
}

export default authAPI
