import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Abonnements.module.css";

interface Abonnement {
  idAbonnement: number;
  montant: number;
  description: string;
  frequence: string;
  date_debut: string;
  date_fin?: string;
  date_prelevement?: string;
}

const Abonnements = () => {
  const { user } = useAuth();
  const [montant, setMontant] = useState("");
  const [frequence, setFrequence] = useState("mensuel");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [datePrelevement, setDatePrelevement] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [modeEdition, setModeEdition] = useState(false);
  const [abonnementEnCoursEdition, setAbonnementEnCoursEdition] = useState<Abonnement | null>(null);

  useEffect(() => {
    if (user) fetchAbonnements();
  }, [user]);

  const fetchAbonnements = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/abonnements?utilisateurId=${user?.utilisateurId}`);
      setAbonnements(response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des abonnements :", error);
    }
  };

  const resetForm = () => {
    setMontant("");
    setDescription("");
    setFrequence("mensuel");
    setDateDebut("");
    setDateFin("");
    setDatePrelevement("");
    setModeEdition(false);
    setAbonnementEnCoursEdition(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSoumettre = async () => {
    if (!montant || !description || !dateDebut) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const abonnementData = {
      utilisateurId: user?.utilisateurId,
      montant: Number(montant),
      description,
      frequence,
      dateDebut,
      dateFin: dateFin || null,
      datePrelevement: datePrelevement || null,
    };

    try {
      if (modeEdition && abonnementEnCoursEdition) {
        await axios.put(`http://localhost:5001/api/abonnements/${abonnementEnCoursEdition.idAbonnement}`, abonnementData);
        setSuccessMessage("✅ Abonnement modifié avec succès !");
      } else {
        await axios.post("http://localhost:5001/api/abonnements", abonnementData);
        setSuccessMessage("✅ Abonnement ajouté avec succès !");
      }

      resetForm();
      fetchAbonnements();
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement de l'abonnement :", error);
      setErrorMessage("Erreur lors de l'enregistrement de l'abonnement.");
      setSuccessMessage("");
    }
  };

  const handleModifier = (abonnement: Abonnement) => {
    setModeEdition(true);
    setAbonnementEnCoursEdition(abonnement);
    setMontant(abonnement.montant.toString());
    setDescription(abonnement.description);
    setFrequence(abonnement.frequence);
    setDateDebut(abonnement.date_debut.slice(0, 10));
    setDateFin(abonnement.date_fin?.slice(0, 10) || "");
    setDatePrelevement(abonnement.date_prelevement?.slice(0, 10) || "");
  };

  const handleSupprimer = async (id: number) => {
    const confirm = window.confirm("⚠️ Voulez-vous vraiment supprimer cet abonnement ?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5001/api/abonnements/${id}`);
      setAbonnements((prev) => prev.filter((a) => a.idAbonnement !== id));
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>📅 Abonnements</h2>
        <p className={styles.text}>Vous devez être connecté pour gérer vos abonnements.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📅 Abonnements</h2>
      <p className={styles.text}>Ajoutez un abonnement récurrent.</p>

      <div>
        <div className={styles.formGroup}>
          <label>Montant (€):</label>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label>Nom de l'abonnement:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label>Date de début:</label>
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label>Date de fin (facultatif):</label>
          <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label>Fréquence de prélèvement:</label>
          <select value={frequence} onChange={(e) => setFrequence(e.target.value)}>
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="personnalise">Personnalisé</option>
          </select>
        </div>

        {frequence === "personnalise" && (
          <div className={styles.formGroup}>
            <label>Date de prélèvement personnalisé:</label>
            <input type="date" value={datePrelevement} onChange={(e) => setDatePrelevement(e.target.value)} required />
          </div>
        )}

        <button className={styles.buttonAdd} onClick={handleSoumettre}>
          {modeEdition ? "💾 Enregistrer les modifications" : "➕ Ajouter l'abonnement"}
        </button>

        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      </div>

      <div className={styles.abonnementsEnCours}>
        <h3>📌 Abonnements en cours :</h3>
        {abonnements.length === 0 ? (
          <p>Aucun abonnement enregistré.</p>
        ) : (
          <ul className={styles.abonnementList}>
            {abonnements.map((a) => (
              <li key={a.idAbonnement} className={styles.abonnementCard}>
                <p><strong>{a.description}</strong></p>
                <p>Montant : {Number(a.montant).toFixed(2)} €</p>
                <p>Fréquence : {a.frequence}</p>
                <p>Début : {new Date(a.date_debut).toLocaleDateString("fr-FR")}</p>
                {a.date_fin && <p>Fin : {new Date(a.date_fin).toLocaleDateString("fr-FR")}</p>}
                {a.date_prelevement && <p>Prélèvement : {new Date(a.date_prelevement).toLocaleDateString("fr-FR")}</p>}

                <div className={styles.actionButtons}>
                  <button className={styles.modifyButton} onClick={() => handleModifier(a)}>✏️ Modifier</button>
                  <button className={styles.deleteButton} onClick={() => handleSupprimer(a.idAbonnement)}>❌ Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Abonnements;
