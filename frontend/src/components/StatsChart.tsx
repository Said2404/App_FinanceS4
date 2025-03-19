import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "../styles/StatsChart.module.css";

// Activer les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  title: string;
  data: { label: string; value: number; color: string }[];
}


  const options = {
    responsive: true, // Rend le graphique adaptatif
    maintainAspectRatio: true, // Conserve les proportions
    plugins: {
      legend: {
        onClick: () => {}, // Désactive le clic sur la légende
      },
      tooltip: {
        enabled: true, // Active les tooltips
        mode: "nearest" as const, // Affiche uniquement l'élément survolé
        intersect: true, // Cache immédiatement le tooltip dès qu'on quitte l'élément
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Fond plus foncé pour lisibilité
        titleColor: "#ffffff", // Couleur du titre en blanc
        titleFont: { size: 16, weight: "bold" }, // ✅ Agrandir le texte du titre
        bodyColor: "#ffffff", // Couleur du texte principal
        bodyFont: { size: 14 }, // ✅ Agrandir le texte du détail
        displayColors: false, // Cache le carré de couleur dans le tooltip
        padding: 10, // ✅ Ajoute de l'espace pour meilleure lisibilité
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label; // ✅ Affiche la catégorie en titre
          },
          label: (tooltipItem: any) => {
            const value = Number(tooltipItem.raw) || 0; // Convertir en nombre
            const datasetIndex = tooltipItem.datasetIndex;
            const dataIndex = tooltipItem.dataIndex;
            const description = tooltipItem.chart.data.labels?.[dataIndex] || "Description inconnue";
            return `💰 ${description}: ${value}€`; // ✅ Affichage clair avec icône et valeur
          },
        },
      },
    },
    hover: {
      mode: "nearest" as const, // Active le tooltip uniquement sur l'élément survolé
      intersect: true, // Cache le tooltip dès qu'on quitte l'élément
    },
  };
  

  const StatsChart: React.FC<ChartProps> = ({ title, data }) => {
    const chartData = {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.value),
          backgroundColor: data.map((d) => d.color),
          borderWidth: 1,
        },
      ],
    };
  
    return (
      <div className={styles.chartContainer} style={{ width: "300px", height: "300px" }}> 
        <h3>{title}</h3>
        <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: true }} /> 
      </div>
    );
  };
  

export default StatsChart;
