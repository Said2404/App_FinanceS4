import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

const Register: React.FC = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");           
  const [objectif, setObjectif] = useState("Suivre mes dépenses");        

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!nom.trim() || !prenom.trim() || !objectif.trim() || !email.trim() || !password.trim()) {
      alert("❌ Tous les champs sont requis !");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    const userData = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      objectif,
      email: email.trim(),
      password: password.trim(),
    };

    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", userData);
      auth.login({
        utilisateurId: response.data.userId,
        email,
        nom,
        prenom,
        objectif,
      });
      
      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.error === "L'utilisateur existe déjà") {
        setEmailError("❌ Cet email est déjà utilisé !");
      } else {
        alert(error.response?.data?.error || "Erreur lors de l'inscription !");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📝 Créer un compte</h2>
      <form onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label>Nom</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Prénom</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
  <label>Objectif</label>
  <select
    value={objectif}
    onChange={(e) => setObjectif(e.target.value)}
    required
  >
    <option>Suivre mes dépenses</option>
    <option>Économiser pour un projet</option>
    <option>Gérer mes abonnements</option>
    <option>Contrôler mon budget mensuel</option>
    <option>Autre</option>
  </select>
</div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {emailError && <p className={styles.message}>{emailError}</p>}
        </div>
        <div className={styles.formGroup}>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Confirmer le mot de passe</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {passwordError && <p className={styles.message}>{passwordError}</p>}
        </div>
        <button type="submit" className={styles.button}>S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
