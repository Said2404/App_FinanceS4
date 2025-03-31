import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/Login.module.css"; // ✅ Import du CSS

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      const userData = {
        utilisateurId: response.data.utilisateurId,
        email: response.data.email,
        nom: response.data.nom,
        prenom: response.data.prenom,
        objectif: response.data.objectif,
      };

      auth.login(userData);
      navigate("/");
    } catch (error) {
      setErrorMessage("❌ Email ou mot de passe incorrect !");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Mot de passe</label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.toggleIcon}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>

        <button type="submit" className={styles.button}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
