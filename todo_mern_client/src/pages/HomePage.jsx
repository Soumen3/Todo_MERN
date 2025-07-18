import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function HomePage() {
  const [user, setUser] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      // navigate('/todos')
    }
    
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Organize Your Life with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                TodoList
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your productivity with our beautiful, intuitive todo application. 
              Track tasks, set priorities, and accomplish your goals with ease.
            </p>
            
            {/* CTA Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Started Free
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex justify-center mb-12">
                <Link
                  to="/todos"
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Go to My Todos
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                </Link>
              </div>
            )}

            {/* Demo Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-600">TodoList Dashboard</div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-gray-700 line-through">Complete landing page design</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                      <div className="w-5 h-5 border-2 border-indigo-400 rounded-full"></div>
                      <span className="text-gray-700">Implement user authentication</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-700">Set up database integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose TodoList?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make TodoList the perfect productivity companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intuitive Task Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, organize, and prioritize tasks with our clean, user-friendly interface. 
                Everything you need is just a click away.
              </p>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your productivity with detailed analytics, completion rates, and visual progress indicators.
              </p>
            </div>
            
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🌟</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Beautiful & Modern</h3>
              <p className="text-gray-600 leading-relaxed">
                Enjoy a sleek, modern design that makes task management feel effortless and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Boost Your Productivity by 300%
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Join thousands of users who have transformed their productivity with TodoList. 
                Our scientifically-designed approach helps you accomplish more in less time.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-lg">Reduce decision fatigue with smart prioritization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-lg">Track progress with detailed analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span className="text-lg">Stay motivated with achievement milestones</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6">Real User Results</h3>
                <div className="space-y-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-3xl font-bold mb-2">87%</div>
                    <div className="text-sm opacity-90">Increase in task completion</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-3xl font-bold mb-2">65%</div>
                    <div className="text-sm opacity-90">Reduction in stress levels</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="text-3xl font-bold mb-2">4.9/5</div>
                    <div className="text-sm opacity-90">Average user rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Productive People Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join our growing community of achievers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-indigo-600 mb-2">2M+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-indigo-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and start organizing your life today. 
            It's free to get started!
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-lg"
              >
                Already have an account?
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                to="/todos"
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Manage My Todos
              </Link>
            </div>
          )}

          {!user && (
            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Free forever plan available
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
