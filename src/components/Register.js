import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth">
  <div className="auth-card">
    <h2>Register</h2>

    <input
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      placeholder="Password"
      type="password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={register}>Register</button>

    <p onClick={() => navigate("/login")}>
      Already have an account? Login
    </p>
  </div>
</div>

  );
}

export default Register;
