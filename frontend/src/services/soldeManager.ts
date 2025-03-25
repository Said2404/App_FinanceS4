class SoldeManager {
    private static instance: SoldeManager;
    private solde: number = 0;
  
    private constructor() {
      const storedSolde = localStorage.getItem("solde");
      this.solde = storedSolde ? parseFloat(storedSolde) : 0;
    }
  
    public static getInstance(): SoldeManager {
      if (!SoldeManager.instance) {
        SoldeManager.instance = new SoldeManager();
      }
      return SoldeManager.instance;
    }
  
    public getSolde(): number {
      return this.solde;
    }
  
    public addMontant(montant: number): void {
      this.solde += montant;
      this.sauvegarder();
    }
  
    public retirerMontant(montant: number): void {
      this.solde -= montant;
      this.sauvegarder();
    }
  
    public reset(): void {
      this.solde = 0;
      this.sauvegarder();
    }
  
    private sauvegarder(): void {
      localStorage.setItem("solde", this.solde.toString());
    }
  }
  
  export default SoldeManager;
  