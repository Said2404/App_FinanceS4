import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Transactions.module.css";

interface Transaction {
  transactionId: number;
  montant: number | string;
  categorie: string;
  type: string;
  description: string;
  date: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  useEffect(() => {
    const utilisateurId = localStorage.getItem("utilisateurId");

    if (!utilisateurId) {
      console.error("❌ Aucun utilisateur connecté !");
      return;
    }

    axios
      .get(`http://localhost:5001/api/transactions?utilisateurId=${utilisateurId}`)
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error("❌ Erreur API:", err));
  }, []);

  // ✅ Fonction qui gère la sélection des transactions indépendamment
  const toggleSelection = (transactionId: number) => {
    setSelectedTransactions((prevSelected) => {
      if (prevSelected.includes(transactionId)) {
        return prevSelected.filter((tid) => tid !== transactionId);
      } else {
        return [...prevSelected, transactionId];
      }
    });
  };

  // ✅ Fonction qui supprime les transactions sélectionnées
  const deleteSelectedTransactions = async () => {
    if (selectedTransactions.length === 0) {
      alert("⚠️ Aucune transaction sélectionnée !");
      return;
    }

    const confirmation = window.confirm("⚠️ Voulez-vous vraiment supprimer les transactions sélectionnées ?");
    if (!confirmation) return;

    try {
      console.log("🗑️ Suppression des transactions avec transactionId :", selectedTransactions);

      await axios.post("http://localhost:5001/api/transactions/delete-multiple", {
        ids: selectedTransactions.filter(id => id !== null), 
      });

      setTransactions((prev) => prev.filter((t) => !selectedTransactions.includes(t.transactionId)));
      setSelectedTransactions([]); 
      alert("✅ Transactions supprimées !");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("❌ Erreur lors de la suppression des transactions !");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📊 Transactions</h2>

      {/* ✅ Bouton de suppression avec désactivation si aucune sélection */}
      <button className={styles.deleteButton} onClick={deleteSelectedTransactions} disabled={selectedTransactions.length === 0}>
        🗑️ Supprimer sélection
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>✔️</th> 
            <th>Montant</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transactionId} className={t.type.toLowerCase() === "dépense" ? styles.expense : styles.revenue}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(t.transactionId)}
                  onChange={() => toggleSelection(t.transactionId)}
                />
              </td>
              <td>{Number(t.montant).toFixed(2)} €</td>
              <td>{t.categorie}</td>
              <td className={t.type.toLowerCase() === "dépense" ? styles.expenseText : styles.revenueText}>
                {t.type.toLowerCase() === "dépense" ? "Dépense" : "Revenu"}
              </td>
              <td>{t.description || "N/A"}</td>
              <td>{new Date(t.date).toLocaleDateString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
