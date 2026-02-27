# CommentsApp

A full-stack comments web app using **React (JS)** frontend and **Django + PostgreSQL** backend.

**Architecture**:
React → JSON → Django views → Django ORM → PostgreSQL

Frontend calls backend REST APIs (no user auth required; all actions use an Admin user).

## Tech Stack

* **Node.js v24** (frontend)
* **Python 3.12** (backend)
* **PostgreSQL 16**
* **React + JavaScript**
* **Django REST Framework**

---

## Quick Start

### Backend Setup

```sh
# Go into backend folder
cd comments-backend/

# Install Python dependencies
pip install -r requirements.txt
```

📌 Copy environment file and edit:

```sh
cp .env.example .env
```

Edit `.env` and set:

* PostgreSQL DB info: `PGUSER`, `PGPASSWORD`, `PGPORT`, `PGDATABASE` (your admin user)
* Django `SECRET_KEY`
* Any other required settings

Grant your user permissions for your database in PostgreSQL:

```sql
-- Replace with your user/db
CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE mydb;
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

Create tables & import sample data:

```sh
python manage.py makemigrations
python manage.py migrate
python manage.py import_json ./data/comments.json
```

Start Django server:

```sh
python manage.py runserver
```

✔ Backend API runs on `http://localhost:8000/`

---

### Frontend Setup

```sh
cd comments-frontend/

npm install
npm run dev
```

✔ Dev server runs on `http://localhost:5173/`

---

## App Overview

### Backend APIs

Each API lives in Django views and uses the ORM for DB operations.

### Models

* **Users**
* **Comments**
* **Likes**
* **CommentImage**

### Frontend Structure

Under `src/`, code organized into:

* **api/** – API calls and configs
* **hooks/** – React hooks for requests
* **components/** – UI and reusable components

---


## Folder Structure (Simplified)

```
comments-backend/
  ├─ manage.py
  ├─ .env.example
  ├─ requirements.txt
  ├─ data/comments.json
  ├─ <Django apps>
comments-frontend/
  ├─ package.json
  ├─ src/
  │    ├─ api/
  │    ├─ hooks/
  │    ├─ types/
  │    └─ components/
  └─ ...
```

---


