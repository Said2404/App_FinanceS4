import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Compte.module.css";

const Compte: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <p>⚠️ Vous devez être connecté pour voir cette page.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>👤 Mon Compte</h2>
      <p className={styles.info}><span className={styles.label}>Nom :</span> {user.nom}</p>
      <p className={styles.info}><span className={styles.label}>Prénom :</span> {user.prenom}</p>
      <p className={styles.info}><span className={styles.label}>Email :</span> {user.email}</p>
      <p className={styles.info}><span className={styles.label}>Objectif :</span> {user.objectif}</p>

      <div className={styles.buttonGroup}>
  <button className={styles.editButton} onClick={() => navigate("/modifier-profil")}>
    ✏️ Modifier mes infos
  </button>
  <button className={styles.passwordButton} onClick={() => navigate("/modifier-mot-de-passe")}>
    🔒 Modifier le mot de passe
  </button>
</div>


    </div>
  );
};

export default Compte;
