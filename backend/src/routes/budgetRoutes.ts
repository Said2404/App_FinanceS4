import express from "express";
import { setBudget, getBudget, resetBudget, increaseBudget } from "../controllers/budgetController"; 

const router = express.Router();

// ✅ Route pour ajouter un budget
router.post("/set", setBudget);

// ✅ Route pour récupérer le budget
router.get("/", getBudget);

router.post("/reset", resetBudget);

// ✅ Route pour augmenter le budget
router.post("/increase", increaseBudget);

export default router;
