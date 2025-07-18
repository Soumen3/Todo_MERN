# API Services Documentation

This directory contains all API service modules for the Todo MERN application. The services provide a clean interface for communicating with the backend API.

## Structure

```
src/services/
├── index.js         # Central export file and utilities
├── apiService.js    # Base API service with common functionality
├── authAPI.js       # Authentication related API calls
└── todoAPI.js       # Todo CRUD operations and related API calls
```

## Usage

### Basic Import
```javascript
import { authAPI, todoAPI, apiService } from '../services'
```

### Individual Service Import
```javascript
import authAPI from '../services/authAPI'
import todoAPI from '../services/todoAPI'
```

## API Services

### apiService (Base Service)
The base service that handles:
- HTTP request methods (GET, POST, PUT, PATCH, DELETE)
- Authentication headers
- Error handling
- Token management

### authAPI
Handles all authentication related operations:
- User registration and login
- Password management
- Profile operations
- Email verification
- Token management

### todoAPI
Handles all todo related operations:
- CRUD operations for todos
- Filtering and searching
- Bulk operations
- Statistics
- Category management

## Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

### Authentication
The API service automatically handles authentication by:
- Reading JWT tokens from localStorage
- Adding Bearer tokens to request headers
- Redirecting to login on 401 errors
- Clearing localStorage on logout

## Error Handling

All services include comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

Use the utility functions for consistent error handling:
```javascript
import { formatErrorMessage, isNetworkError, isAuthError } from '../services'
```

## Retry Logic

For critical operations, use the retry utility:
```javascript
import { retryApiCall, todoAPI } from '../services'

const todos = await retryApiCall(() => todoAPI.getTodos())
```

## Examples

### Authentication
```javascript
// Login
try {
  const result = await authAPI.login({ email, password })
  console.log('Login successful:', result)
} catch (error) {
  console.error('Login failed:', error.message)
}

// Register
try {
  const result = await authAPI.register({ name, email, password })
  console.log('Registration successful:', result)
} catch (error) {
  console.error('Registration failed:', error.message)
}
```

### Todo Operations
```javascript
// Get todos with filters
const todos = await todoAPI.getTodos({
  status: 'pending',
  priority: 'high',
  search: 'important task'
})

// Create todo
const newTodo = await todoAPI.createTodo({
  title: 'New Task',
  description: 'Task description',
  priority: 'medium',
  category: 'work'
})

// Toggle completion
await todoAPI.toggleTodo(todoId, true)

// Delete todo
await todoAPI.deleteTodo(todoId)
```

## Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Use loading states**: Show loading indicators during API calls
3. **Implement retry logic**: For non-critical operations that might fail due to network issues
4. **Cache where appropriate**: Consider caching frequently accessed data
5. **Validate data**: Validate data before sending to API
6. **Use TypeScript**: Consider adding TypeScript for better type safety

## Testing

When testing components that use these services, mock the API calls:

```javascript
import { vi } from 'vitest'
import * as services from '../services'

// Mock the entire service module
vi.mock('../services', () => ({
  todoAPI: {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    // ... other methods
  },
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    // ... other methods
  }
}))
```
