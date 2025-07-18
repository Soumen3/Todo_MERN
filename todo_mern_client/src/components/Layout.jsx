import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    // Listen for localStorage changes
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('todoUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    window.addEventListener('userStateChange', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userStateChange', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar user={user} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
