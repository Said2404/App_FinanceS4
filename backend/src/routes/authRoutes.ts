import express from "express";
import { registerUser, loginUser, updatePassword} from "../controllers/authController"; 

const router = express.Router();

// Route pour l'inscription d'un utilisateur
router.post("/register", registerUser);

// Route pour la connexion d'un utilisateur
router.post("/login", loginUser);

router.post("/update-password", updatePassword);

export default router;
