import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Importation du contexte d'authentification
import styles from "../styles/Navbar.module.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); // ✅ Récupération des infos de l'utilisateur

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>💰 Gestion Financière</h1>
      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.link}>Accueil</Link></li>
        <li><Link to="/transactions" className={styles.link}>Transactions</Link></li>
        <li><Link to="/budgets" className={styles.link}>Budgets</Link></li>
        <li><Link to="/abonnements" className={styles.link}>Abonnements</Link></li>

        {user ? (
          
          // ✅ Affichage du bouton Déconnexion si connecté
          <>
            <li><Link to="/compte" className={styles.link}>Compte</Link></li>
            <button onClick={logout} className={styles.linkButton}>Déconnexion</button>
          </>
          
        ) : (
          // ✅ Affichage de Connexion et Inscription si non connecté
          <>
            <li><Link to="/connexion" className={styles.link}>Connexion</Link></li>
            <li><Link to="/inscription" className={styles.link}>Inscription</Link></li>
            
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
