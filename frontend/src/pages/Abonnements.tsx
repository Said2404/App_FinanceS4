import React from "react";
import styles from "../styles/Abonnements.module.css";

const Abonnements = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📅 Abonnements</h2>
      <p className={styles.text}>Suivez vos abonnements et paiements récurrents.</p>
    </div>
  );
};

export default Abonnements;
