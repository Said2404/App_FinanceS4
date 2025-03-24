import { Request, Response } from "express";
import db from "../config/db";

export const addAbonnement = async (req: Request, res: Response): Promise<void> => {
  const {
    utilisateurId,
    montant,
    description,
    frequence,
    dateDebut,
    dateFin,
    datePrelevement,
  } = req.body;

  if (!utilisateurId || !montant || !description || !frequence || !dateDebut) {
    res.status(400).json({ error: "Champs obligatoires manquants" });
    return;
  }

  try {
    const [result]: any = await db.query(
      `INSERT INTO abonnements (utilisateurId, montant, description, frequence, date_debut, date_fin, date_prelevement)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateurId,
        montant,
        description,
        frequence,
        dateDebut,
        dateFin || null,
        datePrelevement || null,
      ]
    );

    await db.query(
      `INSERT INTO transactions (utilisateurId, montant, categorie, type, description, date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        utilisateurId,
        montant,
        "Abonnement",
        "dépense",
        description,
        dateDebut || new Date()
      ]
    );

    res.status(201).json({ message: "Abonnement et transaction ajoutés" });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'abonnement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getAbonnements = async (req: Request, res: Response): Promise<void> => {
  const utilisateurId = req.query.utilisateurId;
  if (!utilisateurId) {
    res.status(400).json({ error: "utilisateurId requis" });
    return;
  }

  try {
    const [abonnements] = await db.query(
      `SELECT * FROM abonnements WHERE utilisateurId = ? ORDER BY date_debut DESC`,
      [utilisateurId]
    );

    res.status(200).json(abonnements);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des abonnements:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deleteAbonnement = async (req: Request, res: Response): Promise<void> => {
  const { idAbonnement } = req.params;

  try {
    await db.query(`DELETE FROM abonnements WHERE idAbonnement = ?`, [idAbonnement]);
    res.status(200).json({ message: "Abonnement supprimé" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'abonnement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateAbonnement = async (req: Request, res: Response): Promise<void> => {
  const { idAbonnement } = req.params;
  const {
    montant,
    description,
    frequence,
    dateDebut,
    dateFin,
    datePrelevement,
  } = req.body;

  try {
    await db.query(
      `UPDATE abonnements
       SET montant = ?, description = ?, frequence = ?, date_debut = ?, date_fin = ?, date_prelevement = ?
       WHERE idAbonnement = ?`,
      [
        montant,
        description,
        frequence,
        dateDebut,
        dateFin || null,
        datePrelevement || null,
        idAbonnement
      ]
    );
    res.status(200).json({ message: "Abonnement modifié" });
  } catch (error) {
    console.error("❌ Erreur lors de la modification de l'abonnement:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
