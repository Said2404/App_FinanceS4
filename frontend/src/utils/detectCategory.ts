import { CATEGORIES } from "./categories";

export const detectCategoryFromDescription = (description: string): string | null => {
  const normalized = description.toLowerCase();

  for (const category of CATEGORIES) {
    if (normalized.includes(category)) {
      return category;
    }
  }

  return null; 
};
