#!/bin/bash

# Replit Clone Demo Script
# This script demonstrates the application functionality

echo "🚀 Replit Clone - Demo Guide"
echo "=================================="
echo

echo "📁 Project Structure:"
echo "├── backend/                 # Node.js/Express API Server"
echo "│   ├── src/"
echo "│   │   ├── controllers/     # Route handlers"
echo "│   │   ├── models/         # MongoDB models (User, Project)"
echo "│   │   ├── routes/         # API routes (auth, projects, execution)"
echo "│   │   ├── middleware/     # Authentication & error handling"
echo "│   │   ├── utils/          # Socket.io handlers"
echo "│   │   └── config/         # Database configuration"
echo "│   └── package.json"
echo "├── frontend/               # Next.js React Application"
echo "│   ├── app/               # App router pages"
echo "│   │   ├── auth/          # Login/Register page"
echo "│   │   ├── dashboard/     # Project management"
echo "│   │   └── editor/[id]/   # Main IDE interface"
echo "│   ├── components/        # React components"
echo "│   │   ├── CodeEditor.tsx # Monaco editor integration"
echo "│   │   ├── FileTree.tsx   # File navigation"
echo "│   │   ├── Console.tsx    # Code execution output"
echo "│   │   └── TopBar.tsx     # IDE header with run button"
echo "│   ├── contexts/          # React contexts"
echo "│   │   ├── AuthContext.tsx# Authentication state"
echo "│   │   └── SocketContext.tsx# Real-time collaboration"
echo "│   └── types/             # TypeScript definitions"
echo "└── package.json           # Root project configuration"
echo

echo "🛠️  Setup Instructions:"
echo "1. Install dependencies:"
echo "   npm run install:all"
echo
echo "2. Set up environment variables:"
echo "   # Backend (.env)"
echo "   MONGODB_URI=mongodb://localhost:27017/replit-clone"
echo "   JWT_SECRET=your-secret-key"
echo "   PORT=5000"
echo "   FRONTEND_URL=http://localhost:3000"
echo
echo "   # Frontend (.env.local)"
echo "   NEXT_PUBLIC_API_URL=http://localhost:5000/api"
echo "   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000"
echo
echo "3. Start MongoDB:"
echo "   mongod"
echo
echo "4. Run the application:"
echo "   npm run dev"
echo
echo "5. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo

echo "🎯 Features Implemented:"
echo "✅ User Authentication (JWT)"
echo "✅ Project Management (CRUD)"
echo "✅ Monaco Code Editor"
echo "✅ Multi-language Support (JS, Python, HTML, C++, Java, TS)"
echo "✅ Code Execution (Piston API)"
echo "✅ Real-time Collaboration (Socket.io)"
echo "✅ File Tree Navigation"
echo "✅ Console Output"
echo "✅ Responsive UI (Tailwind CSS)"
echo "✅ Error Handling"
echo "✅ Project Templates"
echo

echo "🧪 API Testing Examples:"
echo

echo "# Health Check"
echo "curl http://localhost:5000/health"
echo

echo "# Register User"
echo 'curl -X POST http://localhost:5000/api/auth/register \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"username":"demo","email":"demo@test.com","password":"password123"}'"'"
echo

echo "# Login User"
echo 'curl -X POST http://localhost:5000/api/auth/login \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"email":"demo@test.com","password":"password123"}'"'"
echo

echo "# Create Project (requires JWT token)"
echo 'curl -X POST http://localhost:5000/api/projects \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer YOUR_JWT_TOKEN" \'
echo '  -d '"'"'{"name":"Hello World","language":"python","template":"blank"}'"'"
echo

echo "# Execute Code (requires JWT token)"
echo 'curl -X POST http://localhost:5000/api/execute \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer YOUR_JWT_TOKEN" \'
echo '  -d '"'"'{"language":"python","code":"print(\"Hello, World!\")"}'"'"
echo

echo "🌟 Key Technologies:"
echo "• Frontend: Next.js 15, TypeScript, Tailwind CSS, Monaco Editor"
echo "• Backend: Node.js, Express, MongoDB, Socket.io"
echo "• Authentication: JWT tokens"
echo "• Code Execution: Piston API (secure sandboxing)"
echo "• Real-time: WebSocket connections"
echo "• Database: MongoDB with Mongoose ODM"
echo

echo "🚀 Production Deployment:"
echo "• Frontend: Deploy to Vercel/Netlify"
echo "• Backend: Deploy to Heroku/AWS/DigitalOcean"
echo "• Database: MongoDB Atlas (cloud)"
echo "• Environment: Set production environment variables"
echo "• Scaling: Use Redis for session storage, load balancers"
echo

echo "Demo complete! 🎉"
echo "The Replit Clone is a fully functional online IDE with all MVP features implemented."