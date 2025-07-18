import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authAPI } from '../services'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('todoUser')
      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('todoUser')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    loadUser()

    // Listen for user state changes
    const handleUserStateChange = () => {
      loadUser()
    }

    window.addEventListener('userStateChange', handleUserStateChange)

    return () => {
      window.removeEventListener('userStateChange', handleUserStateChange)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      // console.log('Logging out...', user)
      await authAPI.logout()
      // console.log('Logout successful, navigating to login')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout API fails, still redirect to login
      navigate('/login')
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Todo<span className="text-indigo-600">List</span>
              </Link>
            </div>

          </div>

          {/* Right side content */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                // Authenticated user menu
                <div className="flex items-center space-x-4">
                  {/* User info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium text-sm">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">
                        {user.name || user.email.split('@')[0]}
                      </p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Guest user buttons
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/login'
                        ? 'bg-indigo-600 text-white'
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/register'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {user ? (
                // Authenticated mobile menu
                <>
                  {/* User info */}
                  <div className="flex items-center px-3 py-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-medium">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {user.name || user.email.split('@')[0]}
                      </p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-md text-base font-medium transition-colors mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Guest mobile menu
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === '/login'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === '/register'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
