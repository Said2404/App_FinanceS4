import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Ajout du contexte Auth

const Register: React.FC = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // ✅ Gestion de l'erreur email
  const [passwordError, setPasswordError] = useState(""); // ✅ Gestion de l'erreur mot de passe
  const navigate = useNavigate();
  const auth = useAuth(); // ✅ Ajout du contexte Auth pour connecter directement

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(""); // Réinitialisation des erreurs
    setPasswordError("");

    if (!nom.trim() || !email.trim() || !password.trim()) {
      alert("❌ Tous les champs sont requis !");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    const userData = { nom: nom.trim(), email: email.trim(), password: password.trim() };

    console.log("📩 Données envoyées :", userData);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", userData);
      console.log("✅ Inscription réussie :", response.data);

      // ✅ Connexion immédiate après l'inscription
      auth.login({ utilisateurId: response.data.userId, email, nom});
      navigate("/");

    } catch (error: any) {
      console.error("❌ Erreur lors de l'inscription :", error.response?.data || error);
      if (error.response?.data?.error === "L'utilisateur existe déjà") {
        setEmailError("❌ Cet email est déjà utilisé !");
      } else {
        alert(error.response?.data?.error || "Erreur lors de l'inscription !");
      }
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Nom</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>} {/* ✅ Message en rouge */}
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirmer le mot de passe</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>} {/* ✅ Message en rouge */}
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
