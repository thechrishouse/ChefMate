# CookMate Backend

This is the backend server for CookMate, a recipe management and sharing platform. Built with Node.js, Express, and PostgreSQL with Prisma as the ORM.

## Features

- 👤 **User Authentication**

  - Registration and login with JWT-based authentication
  - Password hashing using bcrypt
  - Protected routes with middleware authentication

- 🍳 **Recipe Management**

  - Create, read, update, and delete recipes
  - Support for public and private recipes
  - Recipe details including prep time, cook time, difficulty, and servings
  - Structured storage of ingredients and instructions

- 📊 **User Dashboard**

  - Track created recipes
  - Save favorite recipes
  - Mark recipes as cooked
  - User statistics and activity tracking

- 🔒 **Security**
  - JWT-based authentication
  - Password hashing
  - Input validation middleware
  - Error handling middleware

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Database configuration
│   └── jwt.js        # JWT configuration
├── controllers/      # Route controllers
│   ├── authController.js
│   ├── dashboardController.js
│   ├── recipeController.js
│   └── userController.js
├── middleware/      # Express middleware
│   ├── auth.js      # JWT authentication
│   ├── errorHandler.js
│   └── validation.js
├── prisma/         # Database ORM
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── routes/         # API routes
│   ├── auth.js
│   ├── dashboard.js
│   ├── recipes.js
│   └── users.js
└── utils/          # Utility functions
    ├── queryHelpers.js
    └── responseHelpers.js
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Little-Friendly/CookMate.git
   cd CookMate/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=8080
   DATABASE_URL="postgresql://user:password@localhost:5432/cookmate"
   DIRECT_URL="postgresql://user:password@localhost:5432/cookmate"
   JWT_SECRET="your-secret-key"
   ```

4. Set up the database:

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # (Optional) Seed the database
   npm run db:seed
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio to manage data
- `npm run db:seed` - Seed the database with initial data

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Recipes

- `GET /api/recipes` - Get all public recipes
- `GET /api/recipes/:id` - Get specific recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### User & Dashboard

- `GET /api/dashboard` - Get user dashboard data
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## Error Handling

The API uses a centralized error handling middleware that catches all errors and returns appropriate HTTP status codes and error messages in a consistent format:

```json
{
  "status": "error",
  "message": "Error message here",
  "code": 400
}
```

## Database Schema

The application uses Prisma as the ORM with PostgreSQL. Key models include:

- `User` - User accounts and profiles
- `Recipe` - Recipe details and content
- `SavedRecipe` - Recipes saved by users
- `CookedRecipe` - Recipes marked as cooked by users

For detailed schema information, see `prisma/schema.prisma`.

## Contributing

1. Clone the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
