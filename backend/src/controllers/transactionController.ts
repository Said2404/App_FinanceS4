import { Request, Response } from "express";
import db from "../config/db";

export const getTransactions = async (req: Request, res: Response) => {
  const utilisateurId = Number(req.query.utilisateurId); 

  if (!utilisateurId) {
    return res.status(400).json({ error: "Utilisateur non connecté" });
  }

  try {
    console.log(`🔍 Récupération des transactions pour utilisateurId: ${utilisateurId}`);

    const [rows] = await db.query(
      "SELECT * FROM transactions WHERE utilisateurId = ? ORDER BY date DESC",
      [utilisateurId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des transactions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const addTransaction = async (req: Request, res: Response): Promise<void> => {
  console.log("📩 Données reçues par le backend :", req.body);

  const { utilisateurId, montant, categorie, type, description } = req.body;

  if (!utilisateurId || !montant || !categorie || !type || !description) {
    console.error("❌ Données manquantes :", req.body);
    res.status(400).json({ error: "Tous les champs sont requis" });
    return;
  }

  try {
    console.log("📤 Insertion SQL en cours...");
    const [result]: any = await db.query(
      "INSERT INTO transactions (utilisateurId, montant, categorie, type, description, date) VALUES (?, ?, ?, ?, ?, NOW())",
      [utilisateurId, montant, categorie, type, description]
    );

    console.log("✅ Transaction insérée :", result);
    res.status(201).json({ message: "Transaction ajoutée", transactionId: result.insertId });
  } catch (error) {
    console.error("❌ Erreur SQL :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteTransactions = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => id == null)) {
    return res.status(400).json({ error: "Aucune transaction valide sélectionnée !" });
  }

  try {
    console.log("🗑️ Suppression des transactions avec transactionId :", ids);

    await db.query("DELETE FROM transactions WHERE transactionId IN (?)", [ids]);

    res.json({ message: "Transactions supprimées !" });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur lors de la suppression des transactions" });
  }
};

export const resetTransactions = async (req: Request, res: Response) => {
  const { utilisateurId } = req.body;

  if (!utilisateurId) {
    return res.status(400).json({ error: "Utilisateur non connecté" });
  }

  try {
    await db.query("DELETE FROM transactions WHERE utilisateurId = ?", [utilisateurId]);
    res.json({ message: "Les transactions de l'utilisateur ont été supprimées." });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur lors de la suppression des transactions" });
  }
};
