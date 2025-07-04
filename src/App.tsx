import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import TopographeInterface from './components/Topographe/TopographeInterface';
import Dashboard from './components/Admin/Dashboard';
import AdminTabs from './components/Admin/AdminTabs';
import ReportsManagement from './components/Admin/ReportsManagement';
import UserManagement from './components/Admin/UserManagement';
import ProjectManagement from './components/Admin/ProjectManagement';
import Settings from './components/Admin/Settings';
import ActivityLogs from './components/Admin/ActivityLogs';
import { User, Projet, Phase, Station, Rapport, ActionLog } from './types';
import {
  initializeData,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  saveUsers,
  getProjets,
  saveProjets,
  getPhases,
  savePhases,
  getStations,
  saveStations,
  getRapports,
  saveRapports,
  addRapport,
  getActionLogs,
  addActionLog
} from './utils/storage';

function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'users' | 'projects' | 'settings' | 'logs'>('dashboard');

  useEffect(() => {
    initializeData();
    setCurrentUserState(getCurrentUser());
    setUsers(getUsers());
    setProjets(getProjets());
    setPhases(getPhases());
    setStations(getStations());
    setRapports(getRapports());
    setActionLogs(getActionLogs());
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    addActionLog({
      userId: user.id,
      userName: user.nom,
      action: 'Connexion utilisateur',
      details: `Connexion réussie avec le rôle ${user.role}`
    });
    setActionLogs(getActionLogs());
  };

  const handleLogout = () => {
    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Déconnexion utilisateur',
        details: 'Déconnexion de l\'application'
      });
    }
    setCurrentUser(null);
    setCurrentUserState(null);
    setActionLogs(getActionLogs());
  };

  const handleSubmitReport = (rapport: Rapport) => {
    addRapport(rapport);
    setRapports(getRapports());
    
    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Création de rapport',
        details: `Rapport créé pour le projet ${rapport.projetNom}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleUpdateRapportStatus = (id: string, statut: Rapport['statut']) => {
    const updatedRapports = rapports.map(r => 
      r.id === id ? { ...r, statut } : r
    );
    setRapports(updatedRapports);
    saveRapports(updatedRapports);

    if (currentUser) {
      const rapport = rapports.find(r => r.id === id);
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Modification statut rapport',
        details: `Statut changé vers "${statut}" pour le rapport ${rapport?.projetNom || 'inconnu'}`
      });
      setActionLogs(getActionLogs());
    }
  };

  // Admin functions
  const handleAddUser = (userData: Omit<User, 'id' | 'dateCreation'>) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      dateCreation: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Ajout utilisateur',
        details: `Nouvel utilisateur créé: ${newUser.nom} (${newUser.role})`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleUpdateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === id ? { ...u, ...userData } : u);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser) {
      const user = users.find(u => u.id === id);
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Modification utilisateur',
        details: `Utilisateur modifié: ${user?.nom || 'inconnu'}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Suppression utilisateur',
        details: `Utilisateur supprimé: ${user?.nom || 'inconnu'}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleAddProject = (projectData: Omit<Projet, 'id'>) => {
    const newProject: Projet = {
      id: Date.now().toString(),
      ...projectData
    };
    const updatedProjets = [...projets, newProject];
    setProjets(updatedProjets);
    saveProjets(updatedProjets);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Ajout projet',
        details: `Nouveau projet créé: ${newProject.nom}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleUpdateProject = (id: string, projectData: Partial<Projet>) => {
    const updatedProjets = projets.map(p => p.id === id ? { ...p, ...projectData } : p);
    setProjets(updatedProjets);
    saveProjets(updatedProjets);

    if (currentUser) {
      const projet = projets.find(p => p.id === id);
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Modification projet',
        details: `Projet modifié: ${projet?.nom || 'inconnu'}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleDeleteProject = (id: string) => {
    const projet = projets.find(p => p.id === id);
    const updatedProjets = projets.filter(p => p.id !== id);
    setProjets(updatedProjets);
    saveProjets(updatedProjets);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Suppression projet',
        details: `Projet supprimé: ${projet?.nom || 'inconnu'}`
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleUpdateStations = (updatedStations: Station[]) => {
    setStations(updatedStations);
    saveStations(updatedStations);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Modification stations',
        details: 'Configuration des stations mise à jour'
      });
      setActionLogs(getActionLogs());
    }
  };

  const handleUpdatePhases = (updatedPhases: Phase[]) => {
    setPhases(updatedPhases);
    savePhases(updatedPhases);

    if (currentUser) {
      addActionLog({
        userId: currentUser.id,
        userName: currentUser.nom,
        action: 'Modification phases',
        details: 'Configuration des phases mise à jour'
      });
      setActionLogs(getActionLogs());
    }
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} users={users} />;
  }

  const isMainAdmin = currentUser.role === 'admin' && currentUser.nom.toLowerCase() === 'akram';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-6">
        {currentUser.role === 'topographe' ? (
          <TopographeInterface
            projets={projets}
            phases={phases}
            stations={stations}
            rapports={rapports}
            onSubmit={handleSubmitReport}
            userName={currentUser.nom}
            userId={currentUser.id}
          />
        ) : (
          <div>
            <AdminTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              isMainAdmin={isMainAdmin}
            />
            <div className="mt-6">
              {activeTab === 'dashboard' && (
                <Dashboard rapports={rapports} projets={projets} users={users} />
              )}
              {activeTab === 'reports' && (
                <ReportsManagement 
                  rapports={rapports} 
                  projets={projets} 
                  users={users}
                  onUpdateRapportStatus={handleUpdateRapportStatus}
                />
              )}
              {activeTab === 'users' && isMainAdmin && (
                <UserManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  currentUserId={currentUser.id}
                />
              )}
              {activeTab === 'projects' && isMainAdmin && (
                <ProjectManagement
                  projets={projets}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              )}
              {activeTab === 'settings' && isMainAdmin && (
                <Settings
                  stations={stations}
                  phases={phases}
                  onUpdateStations={handleUpdateStations}
                  onUpdatePhases={handleUpdatePhases}
                />
              )}
              {activeTab === 'logs' && isMainAdmin && (
                <ActivityLogs logs={actionLogs} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;