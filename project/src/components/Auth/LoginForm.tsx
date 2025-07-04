import React, { useState } from 'react';
import { User, Lock, Construction, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
  users: UserType[];
}

export default function LoginForm({ onLogin, users }: LoginFormProps) {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Tentative de connexion:', { nom, motDePasse });
    console.log('Utilisateurs disponibles:', users);

    const user = users.find(u => {
      const nomMatch = u.nom.toLowerCase().trim() === nom.toLowerCase().trim();
      const motDePasseMatch = u.motDePasse === motDePasse;
      const actifMatch = u.actif;
      
      console.log(`Vérification pour ${u.nom}:`, {
        nomMatch,
        motDePasseMatch,
        actifMatch,
        userNom: u.nom,
        userMotDePasse: u.motDePasse,
        inputNom: nom,
        inputMotDePasse: motDePasse
      });
      
      return nomMatch && motDePasseMatch && actifMatch;
    });

    if (user) {
      console.log('Connexion réussie pour:', user);
      onLogin(user);
    } else {
      console.log('Échec de la connexion');
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (demoNom: string, demoPassword: string) => {
    setNom(demoNom);
    setMotDePasse(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Construction className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">SERO-EST</h1>
          <p className="text-slate-600 font-medium">Gestion Topographique</p>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white"
                placeholder="Entrez votre nom d'utilisateur"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-slate-50 focus:bg-white"
                placeholder="Entrez votre mot de passe"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg transform hover:scale-[1.02] disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion...</span>
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

      

        <div className="mt-6 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span>Version 2.0 - SERO-EST © 2025</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}