import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsChart from "../components/StatsChart";
import styles from "../styles/Home.module.css";
import { assignCategoryColor, getCategoryColors } from "../utils/CategoryColors";
import { useNavigate } from "react-router-dom";
import budgetSubject from "../observers/BudgetSubject";
import { TransactionFactory } from "../services/transactionFactory";
import SoldeManager from "../services/soldeManager"; // ✅ Singleton

interface Transaction {
  id?: number;
  montant: number;
  categorie: string;
  type: "dépense" | "revenue";
  description: string;
  color?: string;
  date?: string;
}

const Home: React.FC = () => {
  const [dépenses, setDepenses] = useState<Transaction[]>([]);
  const [revenues, setRevenues] = useState<Transaction[]>([]);
  const [montant, setMontant] = useState("");
  const [categorie, setCategorie] = useState("");
  const [type, setType] = useState<"dépense" | "revenue">("dépense");
  const [description, setDescription] = useState("");
  const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>(getCategoryColors());
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPopup, setShowPopup] = useState(false);
  const [solde, setSolde] = useState<number>(SoldeManager.getInstance().getSolde());
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();

    const observer = () => setShowPopup(true);
    budgetSubject.register(observer);

    return () => budgetSubject.unregister(observer);
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

      const depenses = transactions.filter((t: any) => t.type.toLowerCase() === "dépense");
      const revenues = transactions.filter((t: any) => t.type.toLowerCase() === "revenu");

      setDepenses(depenses);
      setRevenues(revenues);

      const total = depenses.reduce((sum: number, t: any) => sum + Number(t.montant), 0);
      fetchBudgetAndNotify(total);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des transactions :", error);
    }
  };

  const fetchBudgetAndNotify = async (totalDepenses: number) => {
    const utilisateurId = localStorage.getItem("utilisateurId");
    if (!utilisateurId) return;

    try {
      const response = await axios.get(`http://localhost:5001/api/budget?utilisateurId=${utilisateurId}`);
      const budget = response.data.montant;
      budgetSubject.setBudgetInfo(budget, totalDepenses);
    } catch (error) {
      console.error("❌ Erreur récupération budget :", error);
    }
  };

  const addTransaction = async () => {
    const errors: { [key: string]: string } = {};
    if (!montant) errors.montant = "❌ Le montant est requis";
    if (!categorie) errors.categorie = "❌ La catégorie est requise";
    if (!type) errors.type = "❌ Le type est requis";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const utilisateurId = localStorage.getItem("utilisateurId");

    if (!utilisateurId) {
      console.error("❌ Aucun utilisateur connecté !");
      navigate("/connexion");
      return;
    }

    const normalizedCategory = categorie.toLowerCase().trim();
    const assignedColor = assignCategoryColor(normalizedCategory);

    const createdTransaction = TransactionFactory.createTransaction(
      parseFloat(montant),
      normalizedCategory,
      type === "dépense" ? "Dépense" : "Revenu",
      description || "N/A"
    );

    const transactionData = {
      ...createdTransaction,
      utilisateurId: Number(utilisateurId),
      color: assignedColor,
    };

    console.log("📩 Données envoyées :", transactionData);

    try {
      await axios.post("http://localhost:5001/api/transactions", transactionData);
      fetchTransactions();
      setMontant("");
      setCategorie("");
      setDescription("");
      setFormErrors({});

      // Mise à jour du solde via Singleton
      const soldeManager = SoldeManager.getInstance();
      if (type === "revenue") {
        soldeManager.addMontant(parseFloat(montant));
      } else {
        soldeManager.retirerMontant(parseFloat(montant));
      }
      setSolde(soldeManager.getSolde());
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la transaction :", error);
    }
  };

  const resetAll = async () => {
    const confirmation = window.confirm("⚠️ Voulez-vous vraiment réinitialiser toutes les transactions ? Cette action est irréversible.");
    if (!confirmation) return;
  
    const utilisateurId = localStorage.getItem("utilisateurId");
  
    if (!utilisateurId) {
      alert("❌ Utilisateur non connecté !");
      return;
    }
  
    try {
      await axios.delete("http://localhost:5001/api/transactions", {
        data: { utilisateurId: Number(utilisateurId) }, // ✅ Envoi dans `data` pour DELETE
      });
  
      setDepenses([]);
      setRevenues([]);
      setCategoryColors({});
      localStorage.removeItem("categoryColors");
  
      // ✅ Réinitialisation du solde avec le Singleton
      const soldeManager = SoldeManager.getInstance();
      soldeManager.reset();
      setSolde(0);
  
      alert("✅ Vos transactions ont été supprimées !");
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation :", error);
    }
  };
  

  const totaldépenses = dépenses.reduce((sum, e) => sum + (Number(e.montant) || 0), 0);
  const totalRevenues = revenues.reduce((sum, r) => sum + (Number(r.montant) || 0), 0);
  const balance = totalRevenues - totaldépenses;

  const maintenant = new Date();
  const ilYATrentJours = new Date();
  ilYATrentJours.setDate(maintenant.getDate() - 30);

  const depensesRecentes = dépenses.filter((d) => new Date(d.date!) >= ilYATrentJours);
  const revenusRecents = revenues.filter((r) => new Date(r.date!) >= ilYATrentJours);

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popupNotification}>
          ⚠️ Vous avez dépassé 75% de votre budget !
          <button onClick={() => setShowPopup(false)}>Fermer</button>
        </div>
      )}

      <h1 className={styles.title}>Bienvenue sur votre Gestionnaire Financier 💰</h1>
      <p className={styles.text}>Suivez vos finances en toute simplicité.</p>

      <div className={styles.formContainer}>
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        {formErrors.montant && <p style={{ color: "red", marginTop: "-10px" }}>{formErrors.montant}</p>}

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
        {formErrors.categorie && <p style={{ color: "red", marginTop: "-10px" }}>{formErrors.categorie}</p>}

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
        {formErrors.type && <p style={{ color: "red", marginTop: "-10px" }}>{formErrors.type}</p>}

        <button onClick={addTransaction}>Ajouter</button>
        <button className={styles.resetButton} onClick={resetAll}>🔄 Réinitialiser</button>
      </div>

      <div className={styles.statsSection}>
        <StatsChart
          title="Dépenses"
          data={depensesRecentes.map(e => ({
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
          data={revenusRecents.map(r => ({
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
