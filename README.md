📘 EasyStay – Full-Stack Hotel Booking Platform
A modern hotel booking platform built with React + Node.js + Prisma + PostgreSQL
🌐 Live Links
Service
URL
Frontend (Vercel)
https://easy-stay-frontend.vercel.app
Backend (Render)
https://easy-stay-xgxq.onrender.com
🚀 Tech Stack
Frontend
React + Vite
Tailwind CSS
Axios
Framer Motion
React Router
Reusable UI Components
Fully Responsive UI
Dark/Light Mode Support
Backend
Node.js + Express
Prisma ORM (Neon/PostgreSQL)
JWT Authentication
Google OAuth (Optional)
File Upload (Multer)
Owner Dashboard System
Booking Management
3rd Party APIs Integrated
RapidAPI – Booking.com Hotels API
RapidAPI – Google Image Search
Cloudinary Image Hosting (optional)
📁 Project Structure
Backend
Copy code

booking-backend/
│── prisma/
│   └── schema.prisma
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── server.js
│── .env
│── package.json
Frontend
Copy code

booking-frontend/
│── src/
│   ├── pages/
│   │   ├── user/
│   │   ├── owner/
│   │   └── auth/
│   ├── components/
│   ├── config/api.js
│   ├── App.jsx
│   └── main.jsx
│── .env
│── vite.config.js
│── package.json
🔑 Environment Variables
🟦 Backend (.env on Render)
Copy code

DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret

# Google Login (Optional)
GOOGLE_CLIENT_ID=your_google_client_id

# RapidAPI Keys
RAPIDAPI_KEY=5c91197fbamshb79bee8efc250dap14482bjsnb363a3156e7d
GOOGLE_IMAGE_API_KEY=5c91197fbamshb79bee8efc250dap14482bjsnb363a3156e7d

# Allowed Frontend URL
FRONTEND_URL=https://easy-stay-frontend.vercel.app
🟩 Frontend (.env on Vercel)
Copy code

VITE_BACKEND=https://easy-stay-xgxq.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id  # OPTIONAL
🔥 Important: Vite Config
vite.config.js
Copy code
Js
export default defineConfig({
  plugins: [react()],
});
NO proxy in production
NO process.env override
🧪 Local Development
Backend
Copy code

cd booking-backend
npm install
npx prisma generate
npm run dev
Frontend
Copy code

cd booking-frontend
npm install
npm run dev
⚙ Deploy Instructions
🟦 Backend on Render
New → Web Service
Connect GitHub repo
Set Root Directory = booking-backend/
Build Command:
Copy code

npm install
Start Command:
Copy code

npm run dev
Add environment variables
Deploy 🎉
🟩 Frontend on Vercel
Import GitHub repo
Set Root Directory → booking-frontend/
Add env vars
Deploy
👨🏻‍💼 Owner Dashboard Features
✔ Add Business Property
✔ Upload Images
✔ Add Rooms
✔ Delete Rooms
✔ Booking Confirm / Cancel
✔ Fully Live Data
✔ Dark/Light Mode
👤 User Side Features
✔ Explore hotels
✔ Advanced Search
✔ View Rooms
✔ Booking System
✔ Payment Page (Dummy or Razorpay)
✔ My Bookings Page
✔ Animations Everywhere
🎆 RapidAPI Features Integrated
1️⃣ Auto-complete
2️⃣ Hotel Search
3️⃣ Hotel Details
4️⃣ Photos
5️⃣ Reviews
6️⃣ Google Image API for attractions
🧱 API Structure
Auth
Copy code

POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
Hotels
Copy code

GET /api/hotels/all
GET /api/hotel/:id
Booking
Copy code

POST /api/booking/create
GET /api/booking/user
Owner
Copy code

GET /api/business/mine
POST /api/business/create
POST /api/business/:id/rooms
DELETE /api/business/:id
🎨 UI Features
Smooth Framer Motion transitions
Premium Card Layout
Central white content box
Responsive grid
Neon green + blue color branding
🙌 Author
Tushar Sharma
Full-Stack Developer
EasyStay Project
