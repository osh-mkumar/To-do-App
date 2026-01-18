# 📝 To-Do App (Kanban Board)

A **full-stack responsive Kanban To-Do application** built with **React and Firebase**, featuring authentication, per-user task storage, real-time updates, and drag-and-drop task management.

## [Try it here!](https://to-do-app-11f4d.web.app)
---

## 🚀 Features

* 🔐 **Authentication** (Email & Password)
* 🧑‍💻 **Per-user tasks** using Firebase Firestore
* 📦 **Kanban board** (To Do → Ongoing → Completed)
* 🔄 **Drag & Drop** task movement
* ☁️ **Real-time sync** with Firestore
* ❌ Delete tasks
* 🚪 Logout support
* ✨ Clean UI with animations
* 🌌 Aesthetic starry background
* 📭 Empty-state UI for better UX

---

## 🛠️ Tech Stack

* **Frontend:** React, JavaScript, HTML, CSS
* **Backend / Database:** Firebase Firestore
* **Authentication:** Firebase Auth
* **Animations:** GSAP
* **Routing:** React Router DOM

---

## 📂 Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── firebase.js
│   ├── App.js
│   └── App.css
├── package.json
└── README.md
```
## How it looks!
<img width="959" height="468" alt="image" src="https://github.com/user-attachments/assets/b9dc31d0-8d86-4028-88ca-d37069a62f28" />
<img width="959" height="470" alt="image" src="https://github.com/user-attachments/assets/cc52b2b5-45c5-4d66-b9f8-03ecc63cb701" />
<img width="959" height="470" alt="image" src="https://github.com/user-attachments/assets/5feed0e0-79b6-4c7e-b6aa-de06542a7c0a" />
<img width="959" height="473" alt="image" src="https://github.com/user-attachments/assets/87f174c1-266c-4a9f-baa8-ab1cf6242f93" />

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/osh-mkumar/To-do-App.git
cd todo-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Firebase setup

* Create a Firebase project
* Enable **Authentication (Email/Password)**
* Enable **Firestore**
* Add your Firebase config to `src/firebase.js`

### 4️⃣ Run the app

```bash
npm start
```

App runs at:
👉 `http://localhost:3000`

---

## 🔐 Firestore Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {

      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📌 How It Works

1. User registers / logs in
2. Tasks are stored with the user’s UID
3. Only the logged-in user can read/write their tasks
4. Dragging a task updates its status in Firestore
5. UI updates in real time

---

## 🧠 What I Learned

* Building **protected routes** in React
* Integrating **Firebase Auth & Firestore**
* Writing **secure Firestore rules**
* Handling **real-time data updates**
* Managing drag-and-drop with async database updates
* Debugging GSAP + React StrictMode issues

---

