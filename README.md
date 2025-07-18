# TodoList - MERN Stack Application

A modern, full-stack todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, responsive design, and beautiful UI.

![TodoList](https://img.shields.io/badge/MERN-Stack-blue) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## ✨ Features

### 🔐 **Authentication System**
- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Rate limiting for login attempts
- Session management with localStorage

### 📝 **Todo Management**
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Real-time todo updates
- Bulk operations (delete multiple todos)
- Todo ownership verification

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Beautiful landing page with animations
- Clean and intuitive interface
- Mobile-friendly navigation
- Loading states and error handling

### 🛡️ **Security Features**
- Input validation and sanitization
- User data isolation
- CORS protection
- Environment variable configuration
- Error handling and logging

## 🚀 Tech Stack

### **Frontend**
- **React** (18.3.1) - UI Framework
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios/Fetch** - HTTP client for API calls

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Todo_MERN/
├── todo_mern_client/          # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── TodosPage.jsx
│   │   ├── services/         # API services
│   │   │   ├── apiService.js
│   │   │   ├── authAPI.js
│   │   │   └── todoAPI.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── todo_mern_server/         # Backend Express application
│   ├── config/              # Configuration files
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── validation.js   # Input validation
│   ├── models/             # Database models
│   │   ├── Users.js       # User schema
│   │   └── Todos.js       # Todo schema
│   ├── routes/            # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── todo.js       # Todo routes
│   │   └── controller.js # Route controllers
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Soumen3/Todo_MERN.git
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd todo_mern_server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Environment Variables
Create a `.env` file in the `todo_mern_server` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/todolist
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todolist

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=5000
```

### 4. Frontend Setup
```bash
# Navigate to client directory
cd ../todo_mern_client

# Install dependencies
npm install

# Create environment file (optional)
# Create .env.local for custom API URL
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env.local
```

### 5. Start the Application

#### Development Mode
```bash
# Terminal 1: Start Backend Server
cd todo_mern_server
npm start

# Terminal 2: Start Frontend Development Server
cd todo_mern_client
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd todo_mern_client
npm run build

# Start backend (serves both API and frontend)
cd ../todo_mern_server
npm run production
```

## 🌐 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login    - User login
POST /api/auth/logout   - User logout
```

### Todo Endpoints (Protected)
```
GET    /api/todo/todos           - Get all user todos
POST   /api/todo/create-todo     - Create new todo
PATCH  /api/todo/todos/:id       - Update specific todo
DELETE /api/todo/todos/:id       - Delete specific todo
POST   /api/todo/todos/bulk-delete - Delete multiple todos
POST   /api/todo/todos/bulk-update - Update multiple todos
```

### Request/Response Examples

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "tc": true
  }'
```

#### Create Todo
```bash
curl -X POST http://localhost:5000/api/todo/create-todo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "todo": {
      "task": "Complete project documentation",
      "status": "active",
      "completed": false
    }
  }'
```

## 🔧 Available Scripts

### Frontend (todo_mern_client)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend (todo_mern_server)
```bash
npm start        # Start server with nodemon
npm run prod     # Start production server
npm test         # Run tests (if configured)
```

## 🎯 Key Features Implementation

### Authentication Flow
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Token sent with each API request
5. Server validates token and extracts user info

### Todo Management
1. All todos are user-specific
2. CRUD operations with ownership verification
3. Real-time UI updates after API calls
4. Bulk operations for efficiency

### Security Measures
- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- Rate limiting on login attempts
- CORS configuration
- User data isolation

## 🌟 Screenshots

### Landing Page
Beautiful, modern landing page with call-to-action buttons and feature highlights.

### Todo Dashboard
Clean, intuitive interface for managing todos with real-time updates.

### Authentication
Secure login and registration forms with validation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the excellent database
- Express.js for the web framework
- All open-source contributors

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub or contact the maintainer.

---

**Happy Coding! 🚀**
