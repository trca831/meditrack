# Medication Tracker App

A full-stack Node.js & Express application to help users track medications, manage inventory, and securely authenticate.

---

## 🚀 Features

- User registration, login, and authentication with Passport.js
- Medication CRUD operations with full access control
- Inventory tracking with photo uploads (optional)
- Password hashing with bcrypt
- Server-side rendering with EJS templates
- Flash notifications for feedback
- Error handling middleware
- Security with Helmet, xss-clean
- Ready for deployment on Render.com

---

## 📋 Requirements Checklist (Rubric)

### Models & Controllers

- [x] **Two or more Mongoose models:**  
  - `User` (auth)  
  - `Medication` 
- [x] **User registration & login with Passport**  
- [x] **Password hashing with bcrypt**  
- [x] **Attribute validation in models**  
- [x] **Full CRUD on medication/inventory**  
- [x] **Access control middleware for protected routes**  
- [x] **User-level access control in controllers**  
- [x] **User notifications via `connect-flash`**  
- [x] **Error handling middleware**  
- [x] **Code style with ESLint & Prettier**

#### Lessons and branches where implemented:
- Registration & login: [Lesson ___] - Branch: `auth-feature`
- Medication CRUD: [Lesson ___] - Branch: `medication-crud`
- Access control: [Lesson ___] - Branch: `auth-middleware`
- Error handling: [Lesson ___] - Branch: `error-handling`
- Validation: [Lesson ___] - Branch: `model-validation`
- Bonus features: [Lesson ___] - Branch: `bonus-features`

---

### User Interface (EJS Views)

- [x] Registration, login, logout pages  
- [x] Medication List 
- [x] Navigation links/buttons  
- [x] Basic CSS styling 

---

### Deployment & Security

- [x] Security middleware: helmet, xss-clean  
- [x] Use dotenv for environment variables  
- [x] Deployment to Render.com  

---

### Bonus

- [ ] Photo upload feature  
- [ ] API testing with Mocha/Chai  
- [ ] Swagger API docs  


---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
