import React, { useEffect, useState } from "react";
import BudgetSubject from "../observers/BudgetSubject";
import styles from "../styles/BudgetPopup.module.css";

const BudgetPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const observer = () => {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    };

    BudgetSubject.register(observer);
    return () => {
      BudgetSubject.unregister(observer); 
    };
  }, []);

  if (!showPopup) return null;

  return (
    <div className={styles.popup}>
      ⚠️ Vous avez dépassé 75% de votre budget !
    </div>
  );
};

export default BudgetPopup;
