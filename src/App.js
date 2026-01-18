import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import gsap from "gsap";

/* 🔐 Firebase */
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* 🔑 Auth Pages */
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";

/* =========================
   MAIN APP
========================= */
function App() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  /* 🔐 AUTH LISTENER */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  /* ☁️ LOAD TASKS FROM FIRESTORE */
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksFromDB = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTasks(tasksFromDB);
    });

    return () => unsubscribe();
  }, [user]);

  /* ➕ ADD TASK */
  const addTask = async () => {
    if (!task.trim() || !user) return;

    await addDoc(collection(db, "tasks"), {
      text: task,
      status: "todo",
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setTask("");
  };

  /* 🔄 MOVE / DELETE TASK */
  const moveTask = async (id, newStatus) => {
    const taskRef = doc(db, "tasks", id);

    if (newStatus === "delete") {
      await deleteDoc(taskRef);
      return;
    }

    await updateDoc(taskRef, { status: newStatus });
  };

  /* 🚪 LOGOUT */
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/app" /> : <Navigate to="/login" />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={user ? <Navigate to="/app" /> : <Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={user ? <Navigate to="/app" /> : <Register />}
        />

        {/* PROTECTED APP */}
        <Route
          path="/app"
          element={
            user ? (
              <KanbanApp
                task={task}
                setTask={setTask}
                tasks={tasks}
                addTask={addTask}
                moveTask={moveTask}
                logout={logout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================
   KANBAN APP
========================= */
function KanbanApp({
  task,
  setTask,
  tasks,
  addTask,
  moveTask,
  logout,
}) {
  /* 🎬 SAFE GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".column",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* 🌌 BACKGROUND */}
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* 🧱 APP UI */}
      <div className="app">
        <h1>TO-DO APP</h1>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            marginBottom: "16px",
          }}
        >
          Logout
        </button>

        <div>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* 🟡 EMPTY STATE */}
        {tasks.length === 0 && (
          <p style={{ marginTop: "20px", opacity: 0.8 }}>
            ✨ No tasks yet — add one or drag it here!
          </p>
        )}

        <div className="board">
          <Column
            title="To Do"
            status="todo"
            tasks={tasks}
            moveTask={moveTask}
          />
          <Column
            title="Ongoing"
            status="ongoing"
            tasks={tasks}
            moveTask={moveTask}
          />
          <Column
            title="Completed"
            status="completed"
            tasks={tasks}
            moveTask={moveTask}
          />
        </div>
      </div>
    </>
  );
}

/* =========================
   COLUMN COMPONENT
========================= */
function Column({ title, status, tasks, moveTask }) {
  const allowDrop = (e) => e.preventDefault();

  const onDrop = async (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    if (!id) return;
    await moveTask(id, status);
  };

  const filtered = tasks.filter((t) => t.status === status);

  return (
    <div className="column" onDragOver={allowDrop} onDrop={onDrop}>
      <h2>{title}</h2>

      {filtered.length === 0 && (
        <p style={{ opacity: 0.6, marginTop: "10px" }}>
          Drop tasks here
        </p>
      )}

      {filtered.map((t) => (
        <div
          key={t.id}
          className={`task ${t.status === "completed" ? "completed-task" : ""}`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("id", t.id);
            e.dataTransfer.effectAllowed = "move";
          }}
        >
          <span className="task-text">{t.text}</span>

          {/* MOBILE DROPDOWN */}
          <select
            className="status-select"
            value={t.status}
            onChange={(e) => moveTask(t.id, e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="delete-btn"
            onClick={() => moveTask(t.id, "delete")}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}


export default App;
