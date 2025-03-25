export class Transaction {
  id?: number;
  montant: number;
  categorie: string;
  type: "Dépense" | "Revenu";
  description: string;
  date?: string;

  constructor(montant: number, categorie: string, type: "Dépense" | "Revenu", description: string = "Ajout manuel") {
    this.montant = montant;
    this.categorie = categorie;
    this.type = type;
    this.description = description;
    this.date = new Date().toISOString();
  }
}

export class TransactionFactory {
  static createTransaction(montant: number, categorie: string, type: "Dépense" | "Revenu", description?: string) {
    return new Transaction(montant, categorie, type, description || "Ajout manuel");
  }
}
