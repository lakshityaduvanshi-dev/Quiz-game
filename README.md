# QuizDeck — MERN Stack Quiz Application

A full-stack quiz platform: user authentication, a dashboard, category and
question management (CRUD), search and filtering, a timed quiz flow with a
countdown ring, and a per-category leaderboard.

Stack: **MongoDB, Express, React (Create React App), Node.js**.
The frontend is scaffolded the classic `create-react-app` way (`react-scripts`,
`public/index.html` + `src/index.js`) — no Vite.

## Project structure

```
quiz-app/
  backend/     Express API + Mongoose models (Node.js)
  frontend/    React app (Create React App / react-scripts)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if your MongoDB URI or JWT secret should be different
```

Make sure MongoDB is running locally (or point `MONGO_URI` in `.env` at an
Atlas connection string), then:

```bash
npm run seed   # creates sample categories/questions + an admin user
npm run dev    # starts the API on http://localhost:5000 (nodemon)
# or: npm start
```

Seeded admin login: `admin@quizapp.com` / `admin123`

### Admin vs. participant accounts

- New accounts from the **Sign up** page are always **participants** by
  default — they can take quizzes and view the leaderboard, but cannot
  create or edit content.
- To create another admin account, set `ADMIN_INVITE_CODE` in `backend/.env`
  to a secret of your choice, then on the Register page click **"Have an
  admin invite code?"** and enter it. The backend checks this code and only
  grants the `admin` role when it matches.
- All category and question create/update/delete routes are protected with
  `adminOnly` middleware — participants get a 403 if they try to call them
  directly.

### API overview

| Method | Route                        | Description                          |
|--------|------------------------------|---------------------------------------|
| POST   | /api/auth/register           | Create an account                     |
| POST   | /api/auth/login              | Log in, returns JWT                   |
| GET    | /api/auth/me                 | Current user (auth required)          |
| GET    | /api/categories              | List categories (search, sort)        |
| POST   | /api/categories              | Create category (auth required)       |
| PUT    | /api/categories/:id          | Update category                       |
| DELETE | /api/categories/:id          | Delete category + its questions       |
| GET    | /api/questions                | List questions (search, filter, page) |
| POST   | /api/questions                | Create question                       |
| PUT    | /api/questions/:id            | Update question                       |
| DELETE | /api/questions/:id             | Delete question                       |
| GET    | /api/quiz/start                | Get a randomized question set         |
| POST   | /api/quiz/submit               | Grade answers, save a score           |
| GET    | /api/leaderboard                | Best score per user, ranked           |
| GET    | /api/leaderboard/me              | Your own recent scores                |
| GET    | /api/admin/stats                  | Category/question/participant counts (admin only) |

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API is not on http://localhost:5000/api
npm start
```

The app runs on http://localhost:3000 and expects the backend on
http://localhost:5000 by default (set via `REACT_APP_API_URL`).

## Features

- **Auth**: JWT-based register/login, protected routes, persisted session.
- **Dashboard**: quick stats, recent scores, and a quiz setup form
  (category, question count, seconds per question, difficulty).
- **Categories module**: full CRUD, live search, sort by name/newest.
- **Questions module**: full CRUD (2–6 options, mark the correct one,
  difficulty, points), search, category/difficulty filters, pagination.
- **Timed quiz**: a circular countdown ring per question; running out of
  time auto-advances and counts as incorrect.
- **Leaderboard**: best score per player, ranked, filterable by category.
- **Responsive UI**: mobile nav, responsive grids, down to small phones.

## Notes for extending

- Add an admin-only guard on category/question mutation routes (currently
  any authenticated user can manage content) if you want stricter roles.
- The `Score` model keeps every attempt, so you could add a "history" chart
  per user without any schema changes.
