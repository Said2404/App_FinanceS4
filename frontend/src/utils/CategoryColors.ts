// src/utils/CategoryColors.ts

// Fonction pour récupérer les couleurs enregistrées
export const getCategoryColors = (): { [key: string]: string } => {
    const storedColors = localStorage.getItem("categoryColors");
    return storedColors ? JSON.parse(storedColors) : {};
  };
  
  // Fonction pour sauvegarder les couleurs dans localStorage
  export const saveCategoryColors = (colors: { [key: string]: string }) => {
    localStorage.setItem("categoryColors", JSON.stringify(colors));
  };
  
  // Fonction pour générer une couleur aléatoire UNIQUE
  export const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Fonction qui attribue une couleur à une catégorie et la stocke
  export const assignCategoryColor = (category: string): string => {
    const colors = getCategoryColors();
  
    // Vérifier si la catégorie a déjà une couleur
    if (!colors[category]) {
      colors[category] = getRandomColor(); // Génère une couleur unique
      saveCategoryColors(colors);
    }
  
    return colors[category];
  };
  