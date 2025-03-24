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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"tous" | "dépense" | "revenu">("tous");

  useEffect(() => {
    const utilisateurId = localStorage.getItem("utilisateurId");

    if (!utilisateurId) {
      console.error("❌ Aucun utilisateur connecté !");
      return;
    }

    axios
      .get(`http://localhost:5001/api/transactions?utilisateurId=${utilisateurId}`)
      .then((res) => {
        setTransactions(res.data);
        setFilteredTransactions(res.data); // Initialiser le filtre avec toutes les transactions
      })
      .catch((err) => console.error("❌ Erreur API:", err));
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = transactions.filter((t) => {
      const matchType =
        filterType === "tous" ||
        t.type.toLowerCase() === filterType;

      const matchSearch =
        t.categorie.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch);

      return matchType && matchSearch;
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, transactions]);

  const toggleSelection = (transactionId: number) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(transactionId)
        ? prevSelected.filter((tid) => tid !== transactionId)
        : [...prevSelected, transactionId]
    );
  };

  const deleteSelectedTransactions = async () => {
    if (selectedTransactions.length === 0) {
      alert("⚠️ Aucune transaction sélectionnée !");
      return;
    }

    const confirmation = window.confirm("⚠️ Supprimer les transactions sélectionnées ?");
    if (!confirmation) return;

    try {
      await axios.post("http://localhost:5001/api/transactions/delete-multiple", {
        ids: selectedTransactions,
      });

      const updated = transactions.filter((t) => !selectedTransactions.includes(t.transactionId));
      setTransactions(updated);
      setSelectedTransactions([]);
    } catch (error) {
      console.error("❌ Erreur suppression :", error);
      alert("Erreur lors de la suppression !");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📊 Transactions</h2>

      {/* 🔍 Zone de filtre */}
      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="🔎 Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
          <option value="tous">Tous</option>
          <option value="dépense">Dépenses</option>
          <option value="revenu">Revenus</option>
        </select>
      </div>

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
          {filteredTransactions.map((t) => (
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

      <button
        className={styles.deleteButton}
        onClick={deleteSelectedTransactions}
        disabled={selectedTransactions.length === 0}
      >
        🗑️ Supprimer sélection
      </button>
    </div>
  );
};

export default Transactions;
