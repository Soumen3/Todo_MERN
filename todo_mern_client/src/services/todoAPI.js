import apiService from './apiService'

// Todo API endpoints
export const todoAPI = {
  // Get all todos for the authenticated user
  async getTodos(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add filter parameters
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.priority) queryParams.append('priority', filters.priority)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
      if (filters.page) queryParams.append('page', filters.page)
      if (filters.limit) queryParams.append('limit', filters.limit)

      const queryString = queryParams.toString()
      const endpoint = queryString ? `/todo/todos?${queryString}` : '/todo/todos'
      
      return await apiService.get(endpoint)
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch todos')
    }
  },

  // Get a single todo by ID
  async getTodo(todoId) {
    try {
      return await apiService.get(`/todo/todos/${todoId}`)
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch todo')
    }
  },

  // Create a new todo
  async createTodo(todoData) {
    try {
      const response = await apiService.post('/todo/create-todo', { todo: todoData })
      console.log(response)
      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to create todo')
    }
  },

  // Update an existing todo
  async updateTodo(todoId, todoData) {
    try {
      return await apiService.put(`/todo/todos/${todoId}`, todoData)
    } catch (error) {
      throw new Error(error.message || 'Failed to update todo')
    }
  },

  // Partially update a todo (e.g., just toggle completion)
  async patchTodo(todoId, updates) {
    try {
      return await apiService.patch(`/todo/todos/${todoId}`, updates)
    } catch (error) {
      throw new Error(error.message || 'Failed to update todo')
    }
  },

  // Delete a todo
  async deleteTodo(todoId) {
    try {
      return await apiService.delete(`/todo/todos/${todoId}`)
    } catch (error) {
      throw new Error(error.message || 'Failed to delete todo')
    }
  },

  // Toggle todo completion status
  async toggleTodo(todoId, isCompleted) {
    try {
      return await this.patchTodo(todoId, { completed: isCompleted })
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle todo')
    }
  },

  // Mark todo as important/urgent
  async toggleImportant(todoId, isImportant) {
    try {
      return await this.patchTodo(todoId, { important: isImportant })
    } catch (error) {
      throw new Error(error.message || 'Failed to update todo importance')
    }
  },

  // Update todo priority
  async updatePriority(todoId, priority) {
    try {
      return await this.patchTodo(todoId, { priority })
    } catch (error) {
      throw new Error(error.message || 'Failed to update todo priority')
    }
  },

  // Update todo category
  async updateCategory(todoId, category) {
    try {
      return await this.patchTodo(todoId, { category })
    } catch (error) {
      throw new Error(error.message || 'Failed to update todo category')
    }
  },

  // Set todo due date
  async setDueDate(todoId, dueDate) {
    try {
      return await this.patchTodo(todoId, { dueDate })
    } catch (error) {
      throw new Error(error.message || 'Failed to set due date')
    }
  },

  // Bulk operations
  async bulkDelete(todoIds) {
    try {
      return await apiService.post('/todo/todos/bulk-delete', { todoIds })
    } catch (error) {
      throw new Error(error.message || 'Failed to delete todos')
    }
  },

  async bulkUpdate(todoIds, updates) {
    try {
      return await apiService.post('/todo/todos/bulk-update', { todoIds, updates })
    } catch (error) {
      throw new Error(error.message || 'Failed to update todos')
    }
  },

  async bulkToggleComplete(todoIds, completed) {
    try {
      return await this.bulkUpdate(todoIds, { completed })
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle todos')
    }
  },

  // Get todo statistics
  async getStats() {
    try {
      return await apiService.get('/todos/stats')
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch todo statistics')
    }
  },

  // Get todos by category
  async getTodosByCategory(category) {
    try {
      return await this.getTodos({ category })
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch todos by category')
    }
  },

  // Get completed todos
  async getCompletedTodos() {
    try {
      return await this.getTodos({ status: 'completed' })
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch completed todos')
    }
  },

  // Get pending todos
  async getPendingTodos() {
    try {
      return await this.getTodos({ status: 'pending' })
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch pending todos')
    }
  },

  // Get overdue todos
  async getOverdueTodos() {
    try {
      return await apiService.get('/todos/overdue')
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch overdue todos')
    }
  },

  // Search todos
  async searchTodos(searchTerm) {
    try {
      return await this.getTodos({ search: searchTerm })
    } catch (error) {
      throw new Error(error.message || 'Failed to search todos')
    }
  }
}

export default todoAPI
