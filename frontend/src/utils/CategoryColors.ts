const predefinedColors = [
  "#506793", "#b1676c", "#b58740", "#43c4b8", "#79bc86",
  "#8ec755", "#864854", "#9d8564", "#465774", "#bca077",
  "#796541", "#b5b6b6", "#a776d4", "#52726d", "#3f7661",
  "#423d44", "#7c72c6", "#c7c574", "#aca081", "#b88e60"
];

class CategoryColorManager {
  private static instance: CategoryColorManager;
  private colors: { [normalizedCategory: string]: string } = {};
  private colorIndex = 0;

  private constructor() {
    const stored = localStorage.getItem("categoryColors");
    this.colors = stored ? JSON.parse(stored) : {};
    this.colorIndex = Object.keys(this.colors).length;
  }

  public static getInstance(): CategoryColorManager {
    if (!CategoryColorManager.instance) {
      CategoryColorManager.instance = new CategoryColorManager();
    }
    return CategoryColorManager.instance;
  }

  private normalize(category: string): string {
    return category.trim().toLowerCase();
  }

  public getColor(category: string): string {
    const normalized = this.normalize(category);

    if (!this.colors[normalized]) {
      const color = predefinedColors[this.colorIndex % predefinedColors.length];
      this.colors[normalized] = color;
      this.colorIndex++;
      this.saveColors();
    }

    return this.colors[normalized];
  }

  private saveColors() {
    localStorage.setItem("categoryColors", JSON.stringify(this.colors));
  }

  public resetColors() {
    this.colors = {};
    this.colorIndex = 0;
    localStorage.removeItem("categoryColors");
  }

  public getAllColors(): { [key: string]: string } {
    return this.colors;
  }
}

export default CategoryColorManager;
