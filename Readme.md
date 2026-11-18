# FAPSS – Inventory & Warehouse Management

A full-stack inventory management web application with login, a dashboard, and a product page (create, list, search).

## Tech Stack

- Frontend (React)
- Backend (Express.js, Node.js)
- Database (MySQL)

## Features

- User login and logout with JWT authentication
- Protected pages (redirects to login when not signed in)
- Dashboard with stock summary cards and charts
- Add and Search product


## Installation
# Frontend
cd frontend
npm create vite@latest .
npm install
npm install react-router-dom axios
# Backend
cd backend
npm init -y
npm install express mysql2/promise bcryptjs nodemon jsonwebtoken

Add "start": "node index.js",
    "dev": "nodemon index.js" to the scripts tag inside the package .json file in backend

## Running the Application

Run the backend and the frontend in two separate terminals.

cd backend
npm run dev

cd frontend
npm run dev