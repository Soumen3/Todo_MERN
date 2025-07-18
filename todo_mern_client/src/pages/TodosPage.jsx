import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { todoAPI } from '../services'

function TodosPage() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Check for user authentication and load todos
  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser')
    if (!savedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(savedUser))
    loadTodos()
  }, [navigate])

  // Load todos from API
  const loadTodos = async () => {
    try {
      setError('')
      const response = await todoAPI.getTodos()
      setTodos(response.todos || response || [])
    } catch (error) {
      console.error('Error loading todos:', error)
      setError('Failed to load todos. Please try again.')
      // If it's an auth error, redirect to login
      if (error.message.includes('Authentication')) {
        navigate('/login')
      }
    }
  }

  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      setIsLoading(true)
      setError('')
      
      try {
        const todoData = {
          task: inputValue.trim(),
          status: 'active',
          completed: false
        }
        
        // Call the API to create a new todo
        const newTodoResponse = await todoAPI.createTodo(todoData)
        
        // Update local state with the new todo at the top of the list
        setTodos(prevTodos => [newTodoResponse.todo, ...prevTodos])
        
        // Reset input field
        setInputValue('')
      } catch (error) {
        console.error('Error creating todo:', error)
        setError('Failed to create todo. Please try again.')
        
        // If it's an auth error, redirect to login
        if (error.message.includes('Authentication')) {
          navigate('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t._id === id || t.id === id)
      if (!todo) return
      
      // Call API to toggle todo
      const updatedTodo = await todoAPI.toggleTodo(id, !todo.completed)
      
      // Update local state
      setTodos(todos.map(todo =>
        (todo._id === id || todo.id === id) ? { ...todo, completed: !todo.completed } : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
      setError('Failed to update todo. Please try again.')
    }
  }

  const deleteTodo = async (id) => {
    try {
      // Call API to delete todo
      await todoAPI.deleteTodo(id)
      
      // Update local state
      setTodos(todos.filter(todo => todo._id !== id && todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo. Please try again.')
    }
  }

  const clearCompleted = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed)
      const completedIds = completedTodos.map(todo => todo._id || todo.id)
      
      // Call API to delete completed todos
      await todoAPI.bulkDelete(completedIds)
      
      // Update local state
      setTodos(todos.filter(todo => !todo.completed))
    } catch (error) {
      console.error('Error clearing completed todos:', error)
      setError('Failed to clear completed todos. Please try again.')
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodosCount = todos.filter(todo => !todo.completed).length
  const completedTodosCount = todos.filter(todo => todo.completed).length

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name || user.email.split('@')[0]}!
          </h1>
          <p className="text-gray-600 text-lg">Stay organized and productive</p>
        </div>

        {/* Main Todo Container */}
        <div className="max-w-2xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
              <button
                onClick={() => setError('')}
                className="float-right text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={addTodo}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Todo'
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-indigo-600">{todos.length}</div>
              <div className="text-gray-600 text-sm">Total</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-amber-600">{activeTodosCount}</div>
              <div className="text-gray-600 text-sm">Active</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl font-bold text-green-600">{completedTodosCount}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl p-2 shadow-md">
              <div className="flex gap-1">
                {['all', 'active', 'completed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                      filter === filterType
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filterType}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {filter === 'completed' ? 'No completed todos' : 
                   filter === 'active' ? 'No active todos' : 'No todos yet'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' ? 'Add your first todo above!' : `Switch to "${filter === 'active' ? 'all' : 'all'}" to see all todos`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTodos.map((todo, index) => (
                  <div
                    key={todo._id || todo.id}
                    className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-200 ${
                      todo.completed ? 'opacity-75' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo._id || todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {todo.completed && <span className="text-xs">✓</span>}
                    </button>
                    
                    <div className="flex-1">
                      <div
                        className={`text-lg ${
                          todo.completed
                            ? 'text-gray-500 line-through'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.task || todo.title || todo.text}
                      </div>
                      <div className="text-sm text-gray-400">
                        Created on {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTodo(todo._id || todo.id)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="text-sm">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear Completed Button */}
          {completedTodosCount > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={clearCompleted}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-200 font-medium"
              >
                Clear Completed ({completedTodosCount})
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default TodosPage
