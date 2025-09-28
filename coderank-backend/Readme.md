# CodeRanks Backend

CodeRanks is an online coding platform designed for practicing programming problems, submitting solutions, and tracking progress. This repository contains the backend server, built with Node.js, Express, and Prisma ORM, providing RESTful APIs for authentication, problem management, code execution, submissions, and playlists.

## Introduction

The CodeRanks backend powers the core features of the platform:
- **User Authentication:** Secure registration, login, and role-based access.
- **Problem Management:** Create, update, and fetch coding problems with test cases and solutions.
- **Code Execution:** Integrates with Judge0 API to run code against custom test cases.
- **Submissions:** Stores user submissions and tracks results.
- **Playlists:** Organize problems into playlists for personalized practice.

## Getting Started

To set up and run the backend server locally:

1. **Clone the repository:**
   ```
   git clone https://github.com/your-username/coderank-backend.git
   ```
2. **Install dependencies:**
   ```
   pnpm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values with your own configuration.
4. **Start the server:**
   ```
   pnpm start
   ```

## API Routes

The backend exposes the following main endpoints:

- `/api/v1/auth` — Authentication (register, login, logout)
- `/api/v1/problems` — Problem CRUD and retrieval
- `/api/v1/execute-code` — Code execution via Judge0
- `/api/v1/submission` — Submission storage and results
- `/api/v1/playlist` — Playlist creation and management

## Environment Variables

Required variables in your `.env` file:

- `PORT` — Port number for the server (default: 8080)
- `JWT_SECRET` — Secret key for JWT authentication
- `JUDGE0_API_KEY` — API key for Judge0 code execution service
- `JUDGE0_API_URL` — Base URL for Judge0 API

## Contributing

Contributions are welcome!  
If you find issues or have suggestions, please open an issue or submit a pull request.

---