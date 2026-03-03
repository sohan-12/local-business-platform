# 🌍 Local Business Platform (Yelp-Style App)

A full-stack Local Business Platform built using **Node.js, Express, PostgreSQL, and Vanilla JavaScript**.  
Users can explore businesses, add reviews, and view average ratings. Admin users can manage business listings.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login
- JWT-based Authentication
- Role-based access control (Admin / User)
- Protected API routes using middleware

### 🏢 Business Management
- Admin can add businesses
- Admin can delete businesses
- Businesses sorted by average rating
- Google Maps integration using latitude & longitude
- Image URL support for businesses

### ⭐ Review System
- Users can add reviews
- One review per user per business
- Review update supported (ON CONFLICT logic)
- Users can delete their own reviews
- Automatic average rating calculation
- Reviews display with username and date

### 🎨 UI
- Responsive card layout
- Search by business name
- Filter by category (Hotels, Restaurants, Cafes, etc.)
- Clean modern design with hover effects

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Middleware for route protection

### Frontend
- HTML
- CSS
- Vanilla JavaScript (No frameworks)

---

## 📂 Project Structure
local-business-platform/
│
├── client/
│ ├── home.html
│ ├── login.html
│ ├── register.html
│ ├── add-business.html
│ ├── home.js
│ ├── addBusiness.js
│ └── style.css
│
├── server/
│ ├── config/
│ │ └── db.js
│ ├── middleware/
│ │ └── auth.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── userRoutes.js
│ │ └── businessRoutes.js
│ ├── app.js
│ └── .env
│
└── README.md


---

## 🗄 Database Tables

### users
- id
- name
- email
- password
- role (admin/user)

### businesses
- id
- owner_id
- name
- category
- description
- address
- latitude
- longitude
- phone
- price_range
- image_url
- created_at

### reviews
- id
- user_id
- business_id
- rating
- comment
- created_at
- UNIQUE(user_id, business_id)

---

## 🔐 Security

- JWT middleware protects review and business routes
- Admin-only protection for adding/deleting businesses
- Token verification on secured APIs
- Users can only delete their own reviews

---

## ⚙️ Setup Instructions


1️⃣ Clone Repository

git clone <your-repo-link>
cd local-business-platform

2️⃣ Install Dependencies
cd server
npm install

3️⃣ Create .env file
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_postgresql_connection_string

4️⃣ Start Server
node app.js

5️⃣ Open Browser
http://localhost:5000


📌 Future Improvements:

Business detail page

Pagination

Owner dashboard

Image upload (file storage instead of URL)

Sorting & advanced filtering



🎯 Project Highlights:

This project demonstrates:

Full-stack development

RESTful API design

PostgreSQL joins & aggregation

Authentication & authorization

Role-based access control

Secure middleware implementation

Clean UI without frontend frameworks



👨‍💻 Author:

Sohan Kumar

Full-Stack Developer | Node.js | Express | PostgreSQL