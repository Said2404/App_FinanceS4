import { Observer } from "./Observer";

export class BudgetObserver implements Observer {
  private page: "transactions" | "budgets";
  private onNotify: (message: string) => void;

  constructor(page: "transactions" | "budgets", onNotify: (message: string) => void) {
    this.page = page;
    this.onNotify = onNotify;
  }

  update(data: any): void {
    
    const { transaction, budgets } = data;

    if (!budgets || !transaction || transaction.type.toLowerCase() !== "dépense") return;

    const categoryBudget = budgets.find((b: any) => b.categorie.toLowerCase() === transaction.categorie.toLowerCase());

    if (categoryBudget) {
      const totalUsed = categoryBudget.depensesActuelles + transaction.montant;
      const overBudget = totalUsed > categoryBudget.montant;

      if (overBudget) {
        const message = `⚠ï¸ Le budget pour "${transaction.categorie}" est dépassé !`;
        this.onNotify(message);
      }
    }
  }
}
