import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Accès à l'utilisateur connecté

const ModifierMdp: React.FC = () => {
  const [ancienMdp, setAncienMdp] = useState("");
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confirmationMdp, setConfirmationMdp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Vérifier l'utilisateur connecté

  if (!user) {
    return <p>⚠️ Vous devez être connecté pour modifier votre mot de passe.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
  
    if (nouveauMdp !== confirmationMdp) {
      setErrorMessage("❌ Les nouveaux mots de passe ne correspondent pas !");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/auth/update-password", { // ✅ Vérifie bien l'URL
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
    <div>
      <h2>Modifier mon mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mot de passe actuel</label>
          <input type="password" value={ancienMdp} onChange={(e) => setAncienMdp(e.target.value)} required />
        </div>
        <div>
          <label>Nouveau mot de passe</label>
          <input type="password" value={nouveauMdp} onChange={(e) => setNouveauMdp(e.target.value)} required />
        </div>
        <div>
          <label>Confirmer le nouveau mot de passe</label>
          <input type="password" value={confirmationMdp} onChange={(e) => setConfirmationMdp(e.target.value)} required />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* ✅ Affichage de l'erreur */}
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default ModifierMdp;
