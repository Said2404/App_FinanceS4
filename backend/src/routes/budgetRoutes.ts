import express from "express";
import { setBudget, getBudget, resetBudget, increaseBudget } from "../controllers/budgetController"; 

const router = express.Router();

router.post("/set", setBudget);

router.get("/", getBudget);

router.post("/reset", resetBudget);

router.post("/increase", increaseBudget);

export default router;
