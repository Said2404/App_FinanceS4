import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "../styles/StatsChart.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartProps {
  title: string;
  data: { label: string; value: number; color: string }[];
}

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

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return `💰 ${value}€`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer} style={{ width: "300px", height: "300px" }}>
      <h3>{title}</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default StatsChart;
