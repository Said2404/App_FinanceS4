import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ModifierProfil.module.css";


const ModifierInfos: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState(user?.nom || "");
  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [objectif, setObjectif] = useState(user?.objectif || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put("http://localhost:5001/api/auth/update-info", {
        utilisateurId: user?.utilisateurId,
        nom,
        prenom,
        email,
        objectif,
      });

      login({
        utilisateurId: user!.utilisateurId,
        nom,
        prenom,
        email,
        objectif,
      });

      setMessage("✅ Informations mises à jour !");
      setTimeout(() => navigate("/compte"), 1500);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
      setMessage("❌ Erreur lors de la mise à jour des informations.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>✏️ Modifier mes informations</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nom</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label>Prénom</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
  <label>Objectif</label>
  <select value={objectif} onChange={(e) => setObjectif(e.target.value)}>
    <option value="">Sélectionnez un objectif</option>
    <option value="Économiser">Économiser</option>
    <option value="Gérer mes dépenses">Gérer mes dépenses</option>
    <option value="Suivre mes abonnements">Suivre mes abonnements</option>
    <option value="Préparer un projet">Préparer un projet</option>
    <option value="Autre">Autre</option>
  </select>
</div>



        <button type="submit" className={styles.button}>💾 Enregistrer</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default ModifierInfos;
