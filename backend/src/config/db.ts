import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Chargement des variables d'environnement :");
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASSWORD =", process.env.DB_PASSWORD ? "******" : "NON DEFINI");
console.log("DB_NAME =", process.env.DB_NAME);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: undefined 
});

// Vérifier la connexion MySQL
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err.message);
    return;
  }
  console.log("✅ Connecté à MySQL !");
  connection.release();
});

export default db.promise();
