import bcrypt from "bcrypt";
import { Request, Response } from "express";
import db from "../config/db";

// 📌 Fonction pour l'inscription d'un utilisateur
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, nom } = req.body;

  if (!email || !password || !nom) {
    res.status(400).json({ error: "Nom, email et mot de passe sont requis" });
    return;
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUser]: any = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      res.status(400).json({ error: "L'utilisateur existe déjà" });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const [result]: any = await db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)",
      [nom, email, hashedPassword]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: result.insertId });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Fonction pour la connexion d'un utilisateur
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
      nom: user.nom, // ✅ Renvoie le nom de l'utilisateur
    });
    
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
// 📌 Mettre à jour le mot de passe
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { email, ancienMdp, nouveauMdp } = req.body;

  if (!email || !ancienMdp || !nouveauMdp) {
    res.status(400).json({ error: "Tous les champs sont requis" });
    return;
  }

  try {
    // Vérifier si l'utilisateur existe
    const [rows]: any = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
      return;
    }

    const user = rows[0];

    // Vérifier l'ancien mot de passe
    const isPasswordCorrect = await bcrypt.compare(ancienMdp, user.mot_de_passe);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: "Ancien mot de passe incorrect" });
      return;
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(nouveauMdp, 10);

    // Mettre à jour le mot de passe dans la base de données
    await db.query("UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?", [hashedPassword, email]);

    res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la modification du mot de passe :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};