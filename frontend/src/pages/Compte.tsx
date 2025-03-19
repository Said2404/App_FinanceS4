import React from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Accès aux infos utilisateur
import { useNavigate } from "react-router-dom";

const Compte: React.FC = () => {
  const { user } = useAuth(); // ✅ Récupérer l'utilisateur connecté
  const navigate = useNavigate();

  if (!user) {
    return <p>⚠️ Vous devez être connecté pour voir cette page.</p>;
  }

  return (
    <div>
      <h2>Mon Compte</h2>
      <p><strong>Nom :</strong> {user.nom}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <button onClick={() => navigate("/modifier-mot-de-passe")}>Modifier le mot de passe</button>
    </div>
  );
};

export default Compte;
