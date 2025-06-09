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
- Security with Helmet, xss-clean, rate limiting
- Ready for deployment on Render.com

---

## 📋 Requirements Checklist (Rubric)

### Models & Controllers

- [ ] **Two or more Mongoose models:**  
  - `User` (auth)  
  - `Medication` and/or `Inventory`  
- [ ] **User registration & login with Passport**  
- [ ] **Password hashing with bcrypt**  
- [ ] **Attribute validation in models**  
- [ ] **Full CRUD on medication/inventory**  
- [ ] **Bonus: Search, sort, paging features**  
- [ ] **Access control middleware for protected routes**  
- [ ] **User-level access control in controllers**  
- [ ] **User notifications via `connect-flash`**  
- [ ] **Error handling middleware**  
- [ ] **Code style with ESLint & Prettier**

#### Lessons and branches where implemented:
- Registration & login: [Lesson ___] - Branch: `auth-feature`
- Medication CRUD: [Lesson ___] - Branch: `medication-crud`
- Access control: [Lesson ___] - Branch: `auth-middleware`
- Error handling: [Lesson ___] - Branch: `error-handling`
- Validation: [Lesson ___] - Branch: `model-validation`
- Bonus features: [Lesson ___] - Branch: `bonus-features`

---

### User Interface (EJS Views)

- [ ] Registration, login, logout pages  
- [ ] Medication management forms and listings  
- [ ] Navigation links/buttons  
- [ ] Basic CSS styling  

#### Lessons and branches where implemented:
- Views & templates: [Lesson ___] - Branch: `views-setup`
- Flash messages: [Lesson ___] - Branch: `flash-messages`
- Styling: [Lesson ___] - Branch: `ui-styling`

---

### Deployment & Security

- [ ] Security middleware: helmet, xss-clean, rate limiting  
- [ ] Use dotenv for environment variables  
- [ ] Deployment to Render.com  

#### Lessons and branches where implemented:
- Security setup: [Lesson ___] - Branch: `security`
- Deployment: [Lesson ___] - Branch: `deployment`

---

### Bonus

- [ ] Photo upload feature  
- [ ] API testing with Mocha/Chai  
- [ ] Swagger API docs  

#### Lessons and branches where implemented:
- Photo upload: [Lesson ___] - Branch: `photo-upload`
- Testing: [Lesson ___] - Branch: `tests`
- API docs: [Lesson ___] - Branch: `swagger`

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
