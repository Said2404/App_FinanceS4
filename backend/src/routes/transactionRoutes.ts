import express from "express";
import { addTransaction, getTransactions, resetTransactions, deleteTransactions } from "../controllers/transactionController";

const router = express.Router();

// ✅ Route pour récupérer uniquement les transactions de l'utilisateur connecté
router.get("/", (req, res) => {
  getTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la récupération des transactions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

// ✅ Route pour ajouter une transaction
router.post("/", (req, res) => {
  addTransaction(req, res).catch((err) => {
    console.error("❌ Erreur lors de l'ajout d'une transaction :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

// ✅ Route pour supprimer toutes les transactions
router.delete("/", (req, res) => {
  resetTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la suppression des transactions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

// ✅ Route pour supprimer plusieurs transactions sélectionnées
router.post("/delete-multiple", (req, res) => {
  deleteTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la suppression des transactions sélectionnées :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});


export default router;
