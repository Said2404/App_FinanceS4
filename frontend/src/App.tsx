import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Abonnements from "./pages/Abonnements";
import Connexion from "./pages/Login";
import Inscription from "./pages/Register";
import Compte from "./pages/Compte"; 
import ModifierMdp from "./pages/ModifierMdp";
import React from "react";
import ModifierProfil from "./pages/ModifierProfil";



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/abonnements" element={<Abonnements />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/compte" element={<Compte />} />
            <Route path="/modifier-profil" element={<ModifierProfil />} />
            <Route path="/modifier-mot-de-passe" element={<ModifierMdp />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
