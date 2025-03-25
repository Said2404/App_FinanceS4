import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Budgets.module.css";

const Budgets: React.FC = () => {
  const { user } = useAuth();
  const [budget, setBudget] = useState<number | null>(null);
  const [newBudget, setNewBudget] = useState("");
  const [increaseAmount, setIncreaseAmount] = useState("");
  const [totalDepenses, setTotalDepenses] = useState(0);
  const [dateReset, setDateReset] = useState("");
  const [alert75, setAlert75] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("🔄 Fetch du budget lancé pour utilisateur :", user.utilisateurId);
      fetchBudget();
    }
  }, [user]);

  useEffect(() => {
    if (budget !== null && totalDepenses / budget >= 0.75) {
      setAlert75(true);
      setShowAlert(true);
    } else {
      setAlert75(false);
      setShowAlert(false);
    }
  }, [budget, totalDepenses]);

  const fetchBudget = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/budget?utilisateurId=${user?.utilisateurId}`);
      console.log("📥 Budget récupéré :", response.data);
      setBudget(response.data.montant);
      setTotalDepenses(response.data.totalDepenses);
      setDateReset(response.data.dateReset);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du budget :", error);
    }
  };

  const handleSetBudget = async () => {
    if (!user) {
      alert("❌ Vous devez être connecté pour définir un budget !");
      return;
    }

    const budgetData = {
      utilisateurId: user.utilisateurId,
      montant: parseFloat(newBudget) || 0,
    };

    console.log("📤 Envoi du budget :", budgetData);

    try {
      await axios.post("http://localhost:5001/api/budget/set", budgetData);
      alert("✅ Budget défini avec succès !");
      fetchBudget();
      setNewBudget("");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du budget :", error);
    }
  };

  const handleIncreaseBudget = async () => {
    try {
      await axios.post("http://localhost:5001/api/budget/increase", {
        utilisateurId: user?.utilisateurId,
        montant: parseFloat(increaseAmount),
      });

      alert("✅ Budget augmenté avec succès !");
      setIncreaseAmount("");
      fetchBudget();
    } catch (error) {
      console.error("❌ Erreur lors de l'augmentation du budget :", error);
    }
  };

  const handleResetBudget = async () => {
    if (!window.confirm("⚠️ Voulez-vous vraiment réinitialiser votre budget ? Cette action est irréversible.")) return;

    try {
      await axios.post("http://localhost:5001/api/budget/reset", { utilisateurId: user?.utilisateurId });

      alert("✅ Budget réinitialisé !");
      setBudget(null);
      fetchBudget();
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation du budget :", error);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>📊 Budgets</h2>
        <p className={styles.text}>Vous devez être connecté pour gérer vos budgets.</p>
      </div>
    );
  }
  

  return (
    <div className={styles.container}>
      {showAlert && (
        <div className={styles.notification}>
          ⚠️ Attention ! Vous avez dépassé 75% de votre budget.
          <button onClick={() => setShowAlert(false)}>OK</button>
        </div>
      )}

      <h2 className={styles.title}>💰 Mon Budget</h2>

      {alert75 && <p className={styles.alert}>⚠️ Attention, vous avez dépassé 75% de votre budget !</p>}

      {budget !== null ? (
        <>
          <p>💰 Budget initial : <strong>{budget} €</strong></p>
          <p>💸 Dépenses totales : <strong>{totalDepenses} €</strong></p>
          <p>💼 Budget restant : <strong>{budget - totalDepenses} €</strong></p>
          <p>📅 Réinitialisation prévue le : <strong>{dateReset}</strong></p>

          <input type="number" placeholder="Ajouter au budget" value={increaseAmount} onChange={(e) => setIncreaseAmount(e.target.value)} />
          <button onClick={handleIncreaseBudget}>Augmenter le Budget</button>

          <button onClick={handleResetBudget} className={styles.resetButton}>🔄 Réinitialiser le Budget</button>
        </>
      ) : (
        <div>
          <input type="number" placeholder="Définir mon budget" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} />
          <button onClick={handleSetBudget}>Définir Budget</button>
        </div>
      )}
    </div>
  );
};

export default Budgets;
