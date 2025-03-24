import React, { createContext, useContext, useState, ReactNode } from "react";

interface Transaction {
  transactionId?: number;
  montant: number;
  categorie: string;
  type: "expense" | "revenue";
  description: string;
  date?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateSolde: (amount: number) => void;
  solde: number;
}

interface TransactionProviderProps {
  children: ReactNode; 
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [solde, setSolde] = useState<number>(0);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const updateSolde = (amount: number) => {
    setSolde((prevSolde) => prevSolde - amount);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, updateSolde, solde }}>
      {children}
    </TransactionContext.Provider>
  );
};
