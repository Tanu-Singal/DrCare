# Heathcare Management System
A full-stack healthcare web application for managing patients, doctors,
appointments, and medical records with a secure backend architecture.

## Tech Stack
- Python
- MongoDB
- FastApi
- React
- JWT Authentication

## Features
- User authentication for patients and doctors
- Appointment booking and management
- Patient medical records handling
- Doctor profile management
- Role-based access control
- LangChain based chatBot
- Secure RESTful APIs

## Setup Instructions
1. Clone the repository
   git clone https://github.com/Tanu-Singal/DrCare.git

2. Install dependencies
   npm install

3. Create a .env file and add:
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret

4. Start the server
   npm start

## API Endpoints
- POST /get-doctor-appointment?contact=
- POST /doctor-login
- POST /book-appointment
- GET /get-user-appointments?phone=
- GET /get-reports
- GET /doctors

## ML Integration (Planned)
- Disease risk prediction using patient history
- Appointment demand forecasting

## Disclaimer
This project is a prototype and not intended for real medical diagnosis or treatment.

