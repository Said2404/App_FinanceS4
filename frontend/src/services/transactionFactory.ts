// src/services/transactionFactory.ts
export class Transaction {
    id?: number;
    amount: number;
    category: string;
    type: "expense" | "revenue";
    description: string;
    date?: string;
  
    constructor(amount: number, category: string, type: "expense" | "revenue", description: string = "Ajout manuel") {
      this.amount = amount;
      this.category = category;
      this.type = type;
      this.description = description;
      this.date = new Date().toISOString();
    }
  }
  
  export class TransactionFactory {
    static createTransaction(amount: number, category: string, type: "expense" | "revenue", description?: string) {
      return new Transaction(amount, category, type, description || "Ajout manuel");
    }
  }
  