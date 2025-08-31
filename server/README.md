# ICE SUPER Blog - Backend API

This is the backend API for the ICE SUPER iGaming Blog, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - JWT-based authentication with role-based access control
- **Blog Posts** - Create, read, update, and delete blog posts
- **Categories & Tags** - Organize posts with categories and tags
- **Comments** - Nested comment system with moderation
- **Newsletter** - Email subscription management
- **File Uploads** - Image uploads with Cloudinary integration
- **RESTful API** - Well-documented endpoints following REST principles
- **Security** - Input validation, rate limiting, and CORS protection

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Validation**: Express Validator
- **Logging**: Morgan + Winston
- **API Documentation**: (To be added with Swagger/OpenAPI)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ice-super-blog.git
   cd ice-super-blog/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your configuration.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The API will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ice-super-blog

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Mongoose models
├── routes/           # Route definitions
├── utils/            # Utility functions
├── validators/       # Request validation
├── .env.example      # Example environment variables
├── .eslintrc.js      # ESLint config
├── .gitignore        # Git ignore file
├── package.json      # Project metadata and dependencies
└── server.js         # Application entry point
```

## Authentication

Most routes are protected and require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Error Handling

The API follows REST conventions for error responses:

```json
{
  "status": "error",
  "message": "Error message"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/yourusername/ice-super-blog](https://github.com/yourusername/ice-super-blog)
