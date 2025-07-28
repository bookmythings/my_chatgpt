# Replit Clone - Online IDE

A cloud-based integrated development environment (IDE) that allows users to write, run, and collaborate on code directly in the browser. Built with Next.js, Node.js, and MongoDB.

## Features

### ✅ Implemented (MVP)
- **User Authentication**: JWT-based auth with registration and login
- **Project Management**: Create, save, and manage coding projects
- **Multi-Language Support**: JavaScript, Python, HTML/CSS/JS, C++, Java, TypeScript
- **Code Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Code Execution**: Secure sandboxed execution using Piston API
- **Real-time Collaboration**: Live editing with Socket.io
- **File Management**: File tree navigation and editing
- **Responsive UI**: Modern interface built with Tailwind CSS

### 🚧 Coming Soon (Phase 2)
- OAuth integration (Google/GitHub)
- Enhanced collaboration features
- Code deployment and hosting
- Version control integration
- Enhanced templates and boilerplates

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor (VS Code engine)
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Piston API** - Code execution

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my_chatgpt
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Backend (copy and modify):
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Frontend (copy and modify):
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas (cloud)

5. **Run the application**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000).

## Project Structure

```
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, error handling
│   │   ├── utils/          # Socket handlers, helpers
│   │   └── config/         # Database config
│   └── package.json
├── frontend/               # Next.js React app
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities
│   ├── types/             # TypeScript types
│   └── package.json
└── package.json           # Root scripts
```

## Usage

1. **Register/Login**: Create an account at `/auth`
2. **Dashboard**: View and manage projects at `/dashboard`
3. **Create Project**: Choose language and template
4. **Code Editor**: Write code with syntax highlighting
5. **Execute Code**: Click "Run" to execute in secure sandbox
6. **Collaborate**: Share project URLs for real-time collaboration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id/files` - Update project files
- `DELETE /api/projects/:id` - Delete project

### Code Execution
- `POST /api/execute` - Execute code
- `GET /api/execute/languages` - List supported languages

## Development

### Scripts
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build for production
- `npm run lint` - Run linters

### Testing the API
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123"}'

# Test code execution
curl -X POST http://localhost:5000/api/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"language":"python","code":"print(\"Hello, World!\")"}'
```

## Deployment

### Environment Variables
Set these in production:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong JWT secret key
- `FRONTEND_URL` - Frontend domain for CORS
- `NODE_ENV=production`

### Docker Support
TODO: Add Dockerfile and docker-compose for containerized deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## Architecture Notes

### Security
- JWT authentication with HTTP-only cookies (TODO)
- Input sanitization and validation
- Rate limiting on API endpoints
- Sandboxed code execution via Piston API

### Scalability
- Horizontal scaling with load balancers
- Database indexing for performance
- Socket.io clustering for real-time features
- CDN for static assets

### Code Execution
- Uses Piston API for secure, sandboxed execution
- Supports multiple programming languages
- Timeout and memory limits to prevent abuse
- No direct server compilation for security

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](issues)
- Documentation: See `/docs` folder
- API Documentation: Available at `/api/docs` (TODO)