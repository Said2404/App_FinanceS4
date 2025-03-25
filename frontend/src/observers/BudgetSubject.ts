type Observer = () => void;

class BudgetSubject {
  private observers: Observer[] = [];
  private budget: number = 0;
  private totalDepenses: number = 0;

  register(observer: Observer) {
    this.observers.push(observer);
  }

  unregister(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  setBudgetInfo(budget: number, depenses: number) {
    this.budget = budget;
    this.totalDepenses = depenses;
    this.checkThreshold();
  }

  private checkThreshold() {
    const ratio = this.totalDepenses / this.budget;
    if (this.budget > 0 && ratio >= 0.75) {
      this.notify();
    }
  }

  private notify() {
    this.observers.forEach((observer) => observer());
  }

  // ✅ Ajout des alias subscribe/unsubscribe
  subscribe(observer: Observer) {
    this.register(observer);
  }

  unsubscribe(observer: Observer) {
    this.unregister(observer);
  }
}

const budgetSubject = new BudgetSubject();
export default budgetSubject;
