# ChefMate
## Where Home Cooks Become Chefs

Originally built as CookMate during my team fellowship with The Knowledge House, I forked and rebranded the project as ChefMate to reflect my creative direction and continue developing the frontend and UX vision.

ChefMate is a full-stack web application that allows users to create, save, and share recipes with the community. Built with React, it offers a seamless experience for managing your personal cookbook and connecting with other food enthusiasts.

## Features

- 👤 User Authentication (Register/Login)
- 📝 Create and manage recipes
- 💾 Save favorite recipes
- 📊 Track cooking statistics
- 🔄 Smart Meal Planning
- 👥 Community interaction
- 📱 Responsive design for all devices

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend

- Node.js with Express
- Prisma ORM
- PostgreSQL database
- JWT Authentication
- RESTful API architecture
- Supabase

## Project Structure

```
CookMate/
├── backend/              # Backend server code
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── prisma/         # Database schema and migrations
│   ├── routes/         # API routes
│   └── utils/          # Helper utilities
│
├── frontend/            # Frontend React application
│   ├── public/         # Static assets
│   └── src/
│       ├── api/        # API service calls
│       ├── components/ # React components
│       ├── constants/  # Constant values
│       └── layouts/    # Page layouts
│
└── design/             # Design assets and mockups
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Little-Friendly/ChefMate.git
cd ChefMate
```

2. Backend Setup:

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run prisma:migrate
npm run prisma:seed  # Optional: seed the database
npm run dev
```

3. Frontend Setup:

```bash
cd frontend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Environment Variables

Backend (.env):

- PORT=8080
- DATABASE_URL="postgresql://..."
- JWT_SECRET="your-secret-key"
- JWT_EXPIRES_IN="7d"
- JWT_REFRESH_EXPIRES_IN="30d"

Frontend (.env):

- VITE_REACT_APP_API_BASE_URL="http://localhost:8080"

## API Routes

- `/api/auth` - Authentication routes (login, register, refresh token)
- `/api/recipes` - Recipe management
- `/api/users` - User operations
- `/api/dashboard` - Dashboard data

## Development Team

- Bryan Lopez - [@blopez024](https://github.com/blopez024)
- Binu K - [@BinuBims](https://github.com/BinuBims)
- Christopher House - [@thechrishouse](https://github.com/thechrishouse/)
- Kiraah G - [@Krashberry](https://github.com/Krashberry)

## Contributing

1. Clone the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.
