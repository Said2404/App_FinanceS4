import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Abonnements.module.css";
import { getAbonnementIcon } from "../utils/getAbonnementIcon";

interface Abonnement {
  idAbonnement: number;
  montant: number;
  description: string;
  frequence: string;
  date_debut: string;
  date_fin?: string;
  date_prelevement?: string;
}

const Abonnements: React.FC = () => {
  const { user } = useAuth();

  const [montant, setMontant] = useState("");
  const [description, setDescription] = useState("");
  const [frequence, setFrequence] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [datePrelevement, setDatePrelevement] = useState("");

  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [editAbonnement, setEditAbonnement] = useState<Abonnement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) fetchAbonnements();
  }, [user]);

  const fetchAbonnements = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/abonnements?utilisateurId=${user?.utilisateurId}`);
      setAbonnements(response.data);
    } catch (error) {
      console.error("Erreur de récupération :", error);
    }
  };

  const resetForm = () => {
    setMontant("");
    setDescription("");
    setFrequence("");
    setDateDebut("");
    setDateFin("");
    setDatePrelevement("");
    setErrors({});
    setModeEdition(false);
    setEditAbonnement(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!montant) newErrors.montant = "Le montant est requis";
    if (!description) newErrors.description = "Le nom est requis";
    if (!dateDebut) newErrors.dateDebut = "La date de début est requise";
    if (!frequence) newErrors.frequence = "La fréquence est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSoumettre = async () => {
    if (!validateForm()) return;

    const data = {
      utilisateurId: user?.utilisateurId,
      montant: Number(montant),
      description,
      frequence,
      dateDebut,
      dateFin: dateFin || null,
      datePrelevement: datePrelevement || null,
    };

    try {
      if (modeEdition && editAbonnement) {
        await axios.put(`http://localhost:5001/api/abonnements/${editAbonnement.idAbonnement}`, data);
      } else {
        await axios.post("http://localhost:5001/api/abonnements", data);
      }

      resetForm();
      setShowForm(false);
      fetchAbonnements();
    } catch (error) {
      console.error("Erreur soumission :", error);
    }
  };

  const handleModifier = (a: Abonnement) => {
    setShowForm(true);
    setModeEdition(true);
    setEditAbonnement(a);
    setMontant(a.montant.toString());
    setDescription(a.description);
    setFrequence(a.frequence);
    setDateDebut(a.date_debut.slice(0, 10));
    setDateFin(a.date_fin?.slice(0, 10) || "");
    setDatePrelevement(a.date_prelevement?.slice(0, 10) || "");
  };

  const handleSupprimer = async (id: number) => {
    if (!window.confirm("Supprimer cet abonnement ?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/abonnements/${id}`);
      fetchAbonnements();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>📅 Abonnements</h2>
        <p className={styles.text}>🔒 Vous devez être connecté pour voir vos abonnements.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📅 Abonnements en cours</h2>

      <div className={styles.abonnementsList}>
        {abonnements.length === 0 ? (
          <p>Aucun abonnement pour le moment.</p>
        ) : (
          abonnements.map((a) => (
            <div key={a.idAbonnement} className={styles.abonnementCard}>
              <div className={styles.abonnementHeader}>
                <img
                  src={getAbonnementIcon(a.description) || ""}
                  alt={a.description}
                  className={styles.abonnementIcon}
                />
                <strong>{a.description}</strong>
              </div>
              <p>Montant : {Number(a.montant).toFixed(2)} €</p>
              <p>Fréquence : {a.frequence}</p>
              <p>Début : {new Date(a.date_debut).toLocaleDateString("fr-FR")}</p>
              {a.date_fin && <p>Fin : {new Date(a.date_fin).toLocaleDateString("fr-FR")}</p>}
              <div className={styles.actionButtons}>
                <button onClick={() => handleModifier(a)} className={styles.modifyButton}>✏️</button>
                <button onClick={() => handleSupprimer(a.idAbonnement)} className={styles.deleteButton}>❌</button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className={styles.addButton} onClick={() => setShowForm(true)}>➕ Ajouter un abonnement</button>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>{modeEdition ? "Modifier l’abonnement" : "Ajouter un abonnement"}</h3>

            <div className={styles.formGroup}>
              <label>Montant (€)</label>
              <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} />
              {errors.montant && <p className={styles.error}>{errors.montant}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>Nom</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
              {errors.description && <p className={styles.error}>{errors.description}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>Date de début</label>
              <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              {errors.dateDebut && <p className={styles.error}>{errors.dateDebut}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>Date de fin</label>
              <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label>Fréquence</label>
              <select value={frequence} onChange={(e) => setFrequence(e.target.value)}>
                <option value="">-- Choisir une fréquence --</option>
                <option value="mensuel">Mensuel</option>
                <option value="annuel">Annuel</option>
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="personnalise">Personnalisé</option>
              </select>
              {errors.frequence && <p className={styles.error}>{errors.frequence}</p>}
            </div>

            {frequence === "personnalise" && (
              <div className={styles.formGroup}>
                <label>Date de prélèvement</label>
                <input type="date" value={datePrelevement} onChange={(e) => setDatePrelevement(e.target.value)} />
              </div>
            )}

            <div className={styles.popupActions}>
              <button onClick={handleSoumettre} className={styles.buttonAdd}>
                {modeEdition ? "💾 Enregistrer" : "✅ Ajouter"}
              </button>
              <button onClick={() => { resetForm(); setShowForm(false); }} className={styles.cancelButton}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abonnements;
