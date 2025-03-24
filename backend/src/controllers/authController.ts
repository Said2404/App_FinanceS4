import bcrypt from "bcrypt";
import { Request, Response } from "express";
import db from "../config/db";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, nom, prenom, objectif } = req.body;

  if (!email || !password || !nom || !prenom) {
    res.status(400).json({ error: "Nom, prénom, email et mot de passe sont requis" });
    return;
  }

  try {
    const [existingUser]: any = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      res.status(400).json({ error: "L'utilisateur existe déjà" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.query(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, objectif) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, objectif || null]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: result.insertId,
      nom,
      prenom,
      email,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email et mot de passe sont requis" });
    return;
  }

  try {
    const [rows]: any = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const user = rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Mot de passe incorrect" });
      return;
    }

    res.status(200).json({
      message: "Connexion réussie",
      utilisateurId: user.utilisateurId,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      objectif: user.objectif,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { email, ancienMdp, nouveauMdp } = req.body;

  if (!email || !ancienMdp || !nouveauMdp) {
    res.status(400).json({ error: "Tous les champs sont requis" });
    return;
  }

  try {
    const [rows]: any = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const user = rows[0];

    const isPasswordCorrect = await bcrypt.compare(ancienMdp, user.mot_de_passe);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Ancien mot de passe incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(nouveauMdp, 10);

    await db.query("UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?", [hashedPassword, email]);

    res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la modification du mot de passe :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { utilisateurId, nom, prenom, email, objectif } = req.body;

  if (!utilisateurId || !nom || !prenom || !email) {
    res.status(400).json({ error: "Tous les champs obligatoires doivent être remplis." });
    return;
  }

  try {
    await db.query(
      "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, objectif = ? WHERE utilisateurId = ?",
      [nom, prenom, email, objectif || null, utilisateurId]
    );

    res.status(200).json({ message: "Informations utilisateur mises à jour." });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des informations utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
