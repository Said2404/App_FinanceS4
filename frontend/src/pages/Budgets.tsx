import React from "react";
import styles from "../styles/Budgets.module.css";

const Budgets = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>💰 Budgets</h2>
      <p className={styles.text}>Gérez vos budgets et définissez vos objectifs financiers.</p>
    </div>
  );
};

export default Budgets;
