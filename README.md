# 🚀 LocalBiz Reviewer - Backend

Backend REST API for **LocalBiz Reviewer**, a mobile application that helps business owners manage customer reviews, monitor business performance, receive AI-powered insights, manage notifications, and generate review QR codes.

---

## ✨ Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 🔒 Password Hashing with bcrypt
- 🏢 Business Registration & Management
- ⭐ Customer Review Management
- 📊 Dashboard Analytics
- 🤖 AI-Powered Insights
- 🔔 Notifications
- 📱 QR Code Generation
- 🔗 Review Link Management
- ⚡ RESTful API
- 🛡️ Helmet Security Middleware
- 🌐 CORS Support
- 📝 Request Logging with Morgan

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- JavaScript
- Mongoose

### Database

- MongoDB
- MongoDB Atlas

### Authentication & Security

- JWT
- bcryptjs
- Helmet
- CORS

### AI

- OpenAI API
- Google Gemini API

### Other

- Socket.IO
- QRCode
- Express Validator
- Morgan
- UUID

---

## 📁 Project Structure

```text
backend/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── business.routes.js
│   │   ├── review.routes.js
│   │   ├── ai.routes.js
│   │   ├── insights.routes.js
│   │   └── notification.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md