import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes'; // Vérifie bien cet import
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Définition des routes
app.use("/api/auth", authRoutes); // Vérifie bien cette ligne
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
