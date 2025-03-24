import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import budgetRoutes from './routes/budgetRoutes'; 

import authRoutes from './routes/authRoutes'; 
import transactionRoutes from './routes/transactionRoutes';

import abonnementRoutes from './routes/abonnementRoutes';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/api/budget", budgetRoutes); 
app.use("/api/abonnements", abonnementRoutes); 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
