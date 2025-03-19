import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Ajout du contexte Auth

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Un seul état pour l'erreur
  const auth = useAuth(); // ✅ Ajout du contexte Auth
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", { email, password });
  
      console.log("✅ Connexion réussie :", response.data);
  
      const userData = {
        utilisateurId: response.data.utilisateurId, // ✅ Récupération de l'ID
        email: response.data.email,
        nom: response.data.nom, // ✅ Utiliser le vrai nom de l'utilisateur
      };
  
      auth.login(userData); // ✅ Mettre à jour le contexte avec le vrai nom
      navigate("/");
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error);
      setErrorMessage("❌ Email ou mot de passe incorrect !");
    }
  };
  

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* ✅ Message d'erreur unique */}
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
