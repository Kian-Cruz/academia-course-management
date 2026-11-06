# Academia – University Course Management System

A university course management SaaS application built with Next.js, MySQL, Docker, and Docker Compose.

## Project Overview

Academia is a web-based university course management system that allows users to view and manage academic courses. It stores course and instructor information in a MySQL database.

## Technologies Used

- Next.js 16
- TypeScript
- MySQL 8.4
- Docker
- Docker Compose
- Node.js

## Main Features

- View the available course catalog
- Display course codes, titles, credits, semesters, and available seats
- Display instructor information
- Add new courses
- Retrieve course records from MySQL
- REST API for course management

## Project Structure

```text
academia-course-management/
├── app/
│   ├── api/
│   ├── add-course-form.tsx
│   └── page.tsx
├── src/
│   └── lib/
│       └── db.ts
├── mysql/
│   └── init/
│       └── 01-schema.sql
├── Dockerfile
├── compose.yml
├── .dockerignore
├── .env.example
├── package.json
└── README.md
```

## Requirements

- Docker Desktop
- Docker Compose

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/Kian-Cruz/academia-course-management.git
cd academia-course-management
```

2. Create a `.env` file in the project root using `.env.example` as a template. Set your own database passwords.

3. Build and start the application:

```bash
docker compose up -d --build
```

4. Open the application:

```text
http://localhost:3000
```

## Database

The application uses MySQL 8.4.

Docker Compose starts the MySQL database and Next.js application together. The database schema and initial sample records are provided in:

`mysql/init/01-schema.sql`

## Useful Docker Commands

Stop the application:

```bash
docker compose down
```

Start it again:

```bash
docker compose up -d
```

View running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f app
```

## Environment Variables

Database credentials are configured through the `.env` file. Never commit real passwords or secret credentials to GitHub.

## Author

Kian Cruz

## License

This project was created for educational purposes.
