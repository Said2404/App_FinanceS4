import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>💰 Gestion Financière</h1>

      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.link}>Accueil</Link></li>
        <li><Link to="/transactions" className={styles.link}>Transactions</Link></li>
        <li><Link to="/budgets" className={styles.link}>Budgets</Link></li>
        <li><Link to="/abonnements" className={styles.link}>Abonnements</Link></li>
        {user ? (
          <>
            <li><Link to="/compte" className={styles.link}>Compte</Link></li>
            <li>
              <button onClick={logout} className={styles.logoutButton}>Déconnexion</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/connexion" className={styles.logoutButton}>Connexion</Link></li>
            <li><Link to="/inscription" className={styles.logoutButton}>Inscription</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
