# Mark 1 Matrimonial Web Application

Mark 1 is a full-stack matrimonial app with a separated React frontend and Express/MongoDB backend.

## Backend

Location: `backend`

### Setup

```bash
cd backend
npm install
copy .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mark1
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

### Run

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Frontend

Location: `frontend`

### Setup

```bash
cd frontend
npm install
```

### Run

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Verification

The frontend production build has been verified with:

```bash
cd frontend
npm run build
```

The backend entrypoint syntax has been verified with:

```bash
cd backend
node --check server.js
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile

- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/profile/all`
- `GET /api/profile/:id`

### Interest

- `POST /api/interests/send/:userId`
- `GET /api/interests/sent`
- `GET /api/interests/received`
- `GET /api/interests/all` admin only
- `PUT /api/interests/:id/status`
