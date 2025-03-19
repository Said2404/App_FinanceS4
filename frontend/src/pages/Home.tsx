import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsChart from "../components/StatsChart";
import styles from "../styles/Home.module.css";
import { assignCategoryColor, getCategoryColors } from "../utils/CategoryColors";

// Définition des types
interface Transaction {
  id?: number;
  montant: number;
  categorie: string;
  type: "dépense" | "revenue";
  description: string;
  color?: string;
}

const Home: React.FC = () => {
  const [dépenses, setDepenses] = useState<Transaction[]>([]);
  const [revenues, setRevenues] = useState<Transaction[]>([]);
  const [montant, setMontant] = useState("");
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState<"dépense" | "revenue">("dépense");
  const [description, setDescription] = useState("");
  const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>(getCategoryColors());

  // Charger les transactions depuis le backend au démarrage
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const utilisateurId = localStorage.getItem("utilisateurId");
  
    if (!utilisateurId) {
      console.error("❌ Aucun utilisateur connecté !");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5001/api/transactions?utilisateurId=${utilisateurId}`);
      const transactions = response.data;
  
      setDepenses(transactions.filter((t: any) => t.type.toLowerCase() === "dépense"));
      setRevenues(transactions.filter((t: any) => t.type.toLowerCase() === "revenu"));
      
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des transactions :", error);
    }
  };
  

  
  

  const addTransaction = async () => {
    if (!montant || !categorie) {
      console.error("❌ Montant ou catégorie manquant !");
      return;
    }
  
    // Récupérer l'ID utilisateur depuis le localStorage
    const utilisateurId = localStorage.getItem("utilisateurId");
  
    if (!utilisateurId) {
      console.error("❌ Aucun utilisateur connecté !");
      alert("Vous devez être connecté pour ajouter une transaction !");
      return; // ❌ Bloque la création de la transaction
    }
  
    const normalizedCategory = categorie.toLowerCase().trim();
    const assignedColor = assignCategoryColor(normalizedCategory);
  
    const transactionData = {
      utilisateurId: Number(utilisateurId),
      montant: parseFloat(montant),
      categorie: normalizedCategory,
      type: type === "dépense" ? "Dépense" : "Revenu",
      description: description || "N/A",
      color: assignedColor,
    };
  
    console.log("📩 Données envoyées :", transactionData);
  
    try {
      await axios.post("http://localhost:5001/api/transactions", transactionData);
      fetchTransactions();
      setMontant("");
      setCategorie("");
      setDescription("");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la transaction :", error);
    }
  };
  
  
  

  const resetAll = async () => {
    const confirmation = window.confirm("⚠️ Voulez-vous vraiment réinitialiser toutes les transactions ? Cette action est irréversible.");
    
    if (!confirmation) {
      return; // Annule la suppression si l'utilisateur clique sur "Annuler"
    }
  
    try {
      await axios.delete("http://localhost:5001/api/transactions");
      setDepenses([]);
      setRevenues([]);
      setCategoryColors({});
      localStorage.removeItem("categoryColors");
      alert("✅ Toutes les transactions ont été supprimées !");
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation :", error);
    }
  };
  
  

  const totaldépenses = dépenses.reduce((sum, e) => sum + (Number(e.montant) || 0), 0);
  const totalRevenues = revenues.reduce((sum, r) => sum + (Number(r.montant) || 0), 0);
  const balance = totalRevenues - totaldépenses;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bienvenue sur votre Gestionnaire Financier 💰</h1>
      <p className={styles.text}>Suivez vos finances en toute simplicité.</p>

      <div className={styles.formContainer}>
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          <option value="">Sélectionner une catégorie</option>
          <option value="Logement">Logement</option>
          <option value="Transport">Transport</option>
          <option value="Alimentation">Alimentation</option>
          <option value="Shopping">Shopping</option>
          <option value="Loisirs">Loisirs</option>
          <option value="Investissements">Investissements</option>
          <option value="Salaire">Salaire</option>
        </select>
        <input
          type="text"
          placeholder="Description (ex: iPhone 16)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value as "dépense" | "revenue")}>
          <option value="dépense">Dépense</option>
          <option value="revenue">Revenu</option>
        </select>
        <button onClick={addTransaction}>Ajouter</button>
        <button className={styles.resetButton} onClick={resetAll}>🔄 Réinitialiser</button>
      </div>

      <div className={styles.statsSection}>
        <StatsChart
          title="Dépenses"
          data={dépenses.map(e => ({
            label: e.description,
            value: e.montant,
            color: categoryColors[e.categorie] || "#CCCCCC",
          }))}
        />
        <div className={styles.balanceCard}>
          <h3>💰 Solde total</h3>
          <p className={balance >= 0 ? styles.positiveBalance : styles.negativeBalance}>
            {balance} €
          </p>
        </div>
        <StatsChart
          title="Revenus"
          data={revenues.map(r => ({
            label: r.description,
            value: r.montant,
            color: categoryColors[r.categorie] || "#CCCCCC",
          }))}
        />
      </div>
    </div>
  );
};

export default Home;
