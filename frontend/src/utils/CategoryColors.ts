const predefinedColors = [
  "#506793", "#b1676c", "#b58740", "#43c4b8", "#79bc86",
  "#8ec755", "#864854", "#9d8564", "#465774", "#bca077",
  "#796541", "#b5b6b6", "#a776d4", "#52726d", "#3f7661",
  "#423d44", "#7c72c6", "#c7c574", "#aca081", "#b88e60"
];

let colorIndex = 0;

export const getCategoryColors = (): { [key: string]: string } => {
  const storedColors = localStorage.getItem("categoryColors");
  return storedColors ? JSON.parse(storedColors) : {};
};

export const saveCategoryColors = (colors: { [key: string]: string }) => {
  localStorage.setItem("categoryColors", JSON.stringify(colors));
};

export const assignCategoryColor = (category: string): string => {
  const colors = getCategoryColors();

  if (!colors[category]) {
    const color = predefinedColors[colorIndex % predefinedColors.length];
    colors[category] = color;
    colorIndex++;
    saveCategoryColors(colors);
  }

  return colors[category];
};
