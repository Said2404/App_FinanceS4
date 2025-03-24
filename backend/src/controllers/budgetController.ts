import { Request, Response } from "express";
import db from "../config/db";
import dayjs from "dayjs";

export const setBudget = async (req: Request, res: Response): Promise<void> => {
  const { utilisateurId, montant } = req.body;

  if (!utilisateurId || isNaN(montant) || montant <= 0) {
    res.status(400).json({ error: "Données invalides ou manquantes !" });
    return;
  }

  try {
    const [existingBudget]: any = await db.query(
      "SELECT * FROM budgets WHERE utilisateurId = ?",
      [utilisateurId]
    );

    if (existingBudget.length > 0) {
      res.status(400).json({ error: "Un budget existe déjà pour ce mois" });
      return;
    }

    await db.query(
      "INSERT INTO budgets (utilisateurId, montant, dateAjout) VALUES (?, ?, NOW())",
      [utilisateurId, montant]
    );

    res.status(201).json({ message: "Budget défini avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getBudget = async (req: Request, res: Response): Promise<void> => {
  const utilisateurId = Number(req.query.utilisateurId);

  if (!utilisateurId) {
    res.status(400).json({ error: "Utilisateur non connecté" });
    return;
  }

  try {
    const [budget]: any = await db.query(
      "SELECT * FROM budgets WHERE utilisateurId = ? ORDER BY dateAjout DESC LIMIT 1",
      [utilisateurId]
    );

    if (budget.length === 0) {
      res.status(404).json({ error: "Aucun budget défini" });
      return;
    }

    const dateAjout = dayjs(budget[0].dateAjout).format("YYYY-MM-DD");
    const dateReset = dayjs(dateAjout).add(30, "day").format("YYYY-MM-DD");

    const [depenses]: any = await db.query(
      "SELECT SUM(montant) AS totalDepenses FROM transactions WHERE utilisateurId = ? AND type = 'Dépense' AND date BETWEEN ? AND ?",
      [utilisateurId, dateAjout, dateReset]
    );

    res.json({
      montant: budget[0].montant,
      totalDepenses: depenses[0].totalDepenses || 0,
      dateReset,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const resetBudget = async (req: Request, res: Response): Promise<void> => {
  const { utilisateurId } = req.body;

  if (!utilisateurId) {
    res.status(400).json({ error: "Utilisateur non connecté" });
    return;
  }

  try {
    console.log(`🔄 Réinitialisation du budget pour utilisateurId: ${utilisateurId}`);

    const [result]: any = await db.query("DELETE FROM budgets WHERE utilisateurId = ?", [utilisateurId]);

    console.log("🗑️ Résultat de la suppression :", result);

    res.json({ message: "Budget réinitialisé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de la réinitialisation du budget :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const increaseBudget = async (req: Request, res: Response): Promise<void> => {
  const { utilisateurId, montant } = req.body;

  if (!utilisateurId || isNaN(montant) || montant <= 0) {
    res.status(400).json({ error: "Montant invalide" });
    return;
  }

  try {
    console.log(`📈 Augmentation du budget de ${montant}€ pour utilisateurId: ${utilisateurId}`);

    const [result]: any = await db.query(
      "UPDATE budgets SET montant = montant + ? WHERE utilisateurId = ?",
      [montant, utilisateurId]
    );

    console.log("✅ Résultat de la mise à jour :", result);

    res.json({ message: "Budget augmenté avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'augmentation du budget :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
