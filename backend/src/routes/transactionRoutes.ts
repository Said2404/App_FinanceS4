import express from "express";
import { addTransaction, getTransactions, resetTransactions, deleteTransactions } from "../controllers/transactionController";

const router = express.Router();

router.get("/", (req, res) => {
  getTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la récupération des transactions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.post("/", (req, res) => {
  addTransaction(req, res).catch((err) => {
    console.error("❌ Erreur lors de l'ajout d'une transaction :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.delete("/", (req, res) => {
  resetTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la suppression des transactions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.post("/delete-multiple", (req, res) => {
  deleteTransactions(req, res).catch((err) => {
    console.error("❌ Erreur lors de la suppression des transactions sélectionnées :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});


export default router;
