import React, { createContext, useContext, useState, useEffect } from "react";

// Définition du type des données utilisateur
interface User {
  utilisateurId: number;
  email: string;
  nom: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    console.log("🔍 Chargement utilisateur :", user);
  }, [user]);

  const login = (userData: User) => {
    console.log("✅ Connexion enregistrée :", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("utilisateurId", String(userData.utilisateurId));
    setUser(userData);
  };

  const logout = () => {
    console.log("🔴 Déconnexion en cours...");
    localStorage.removeItem("user");
    localStorage.removeItem("utilisateurId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
