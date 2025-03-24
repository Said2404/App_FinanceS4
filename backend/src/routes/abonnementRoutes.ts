import express, { Request, Response } from 'express';
import {
  addAbonnement,
  getAbonnements,
  deleteAbonnement,
  updateAbonnement,
} from '../controllers/abonnementController';

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  addAbonnement(req, res).catch((err) => {
    console.error("Erreur lors de l'ajout de l'abonnement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.get("/", (req: Request, res: Response) => {
  getAbonnements(req, res).catch((err) => {
    console.error("Erreur lors de la récupération des abonnements :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.delete("/:idAbonnement", (req: Request, res: Response) => {
  deleteAbonnement(req, res).catch((err) => {
    console.error("Erreur lors de la suppression de l'abonnement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

router.put("/:idAbonnement", (req: Request, res: Response) => {
  updateAbonnement(req, res).catch((err) => {
    console.error("Erreur lors de la mise à jour de l'abonnement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  });
});

export default router;
