import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/ModifierMdp.module.css";

const ModifierMdp: React.FC = () => {
  const [ancienMdp, setAncienMdp] = useState("");
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmationMdp, setConfirmationMdp] = useState("");
  const [showAncien, setShowAncien] = useState(false);
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return <p className={styles.message}>⚠️ Vous devez être connecté pour modifier votre mot de passe.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (nouveauMdp !== confirmationMdp) {
      setErrorMessage("❌ Les nouveaux mots de passe ne correspondent pas !");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/update-password", {
        email: user.email,
        ancienMdp,
        nouveauMdp,
      });

      alert("✅ Mot de passe modifié !");
      navigate("/");
    } catch (error) {
      console.error("❌ Erreur lors du changement de mot de passe :", error);
      setErrorMessage("❌ Mot de passe incorrect !");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔑 Modifier mon mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Mot de passe actuel</label>
          <input
            type={showAncien ? "text" : "password"}
            value={ancienMdp}
            onChange={(e) => setAncienMdp(e.target.value)}
            required
            className={styles.input}
          />
          <span onClick={() => setShowAncien(!showAncien)} className={styles.toggleIcon}>
            {showAncien ? "🙈" : "👁️"}
          </span>
        </div>

        <div className={styles.formGroup}>
          <label>Nouveau mot de passe</label>
          <input
            type={showNouveau ? "text" : "password"}
            value={nouveauMdp}
            onChange={(e) => setNouveauMdp(e.target.value)}
            required
            className={styles.input}
          />
          <span onClick={() => setShowNouveau(!showNouveau)} className={styles.toggleIcon}>
            {showNouveau ? "🙈" : "👁️"}
          </span>
        </div>

        <div className={styles.formGroup}>
          <label>Confirmer le nouveau mot de passe</label>
          <input
            type={showConfirmation ? "text" : "password"}
            value={confirmationMdp}
            onChange={(e) => setConfirmationMdp(e.target.value)}
            required
            className={styles.input}
          />
          <span onClick={() => setShowConfirmation(!showConfirmation)} className={styles.toggleIcon}>
            {showConfirmation ? "🙈" : "👁️"}
          </span>
        </div>

        {errorMessage && <p className={styles.message}>{errorMessage}</p>}

        <button type="submit" className={styles.button}>Valider</button>
      </form>
    </div>
  );
};

export default ModifierMdp;
