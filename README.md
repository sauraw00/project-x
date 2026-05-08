# Hacker News Scraper MERN App

Mini full-stack MERN assignment that scrapes the top Hacker News stories, stores them in MongoDB, and provides authenticated bookmarking through a React frontend.

## Features

- Scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com)
- Stores story title, URL, points, author, and posted time in MongoDB
- Runs the scraper automatically when the backend starts
- Exposes `POST /api/scrape` to trigger scraping manually
- JWT authentication for register and login
- Story list sorted by points in descending order
- Pagination support through `GET /api/stories?page=1&limit=10`
- Authenticated bookmark toggle with a protected bookmarks page
- React Context API for auth/session state

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
frontend/
  src/
    api/
    components/
    context/
    pages/
```

## Tech Stack

- MongoDB + Mongoose
- Express.js
- React + Vite
- Node.js
- JWT authentication
- Cheerio for scraping

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hn_scraper
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
HN_URL=https://news.ycombinator.com
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Both folders include `.env.example` files with the same values.

## Local Setup

Install all dependencies from the repo root:

```bash
npm run install:all
```

Or install each app separately:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Start MongoDB locally, then run both apps:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Frontend runs at:

```text
http://localhost:5173
```

## API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Scraper

```text
POST /api/scrape
```

### Stories

```text
GET /api/stories
GET /api/stories?page=1&limit=10
GET /api/stories/:id
POST /api/stories/:id/bookmark
```

`POST /api/stories/:id/bookmark` requires an `Authorization: Bearer <token>` header.

## Scripts

Root:

```bash
npm run install:all
npm run dev
npm start
```

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## Notes For Review

The scraper runs once on backend startup after MongoDB connects. It also upserts stories by Hacker News story id, so repeated scrapes refresh points and metadata without duplicating saved stories.
