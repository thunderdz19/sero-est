import { User, Projet, Phase, Station, Rapport, ActionLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'sero-est-users',
  PROJETS: 'sero-est-projets',
  PHASES: 'sero-est-phases',
  STATIONS: 'sero-est-stations',
  RAPPORTS: 'sero-est-rapports',
  CURRENT_USER: 'sero-est-current-user',
  ACTION_LOGS: 'sero-est-action-logs'
};

// Données initiales
const PHASES_INITIALES: Phase[] = [
  { id: '1', nom: 'Fond feuille de la semelle', type: 'standard' },
  { id: '2', nom: 'BP de la semelle', type: 'standard' },
  { id: '3', nom: 'Coffrage de la semelle', type: 'standard' },
  { id: '4', nom: 'Coffrage les fûts', type: 'standard' },
  { id: '5', nom: 'Coffrage chevettre et dés d\'appui', type: 'standard' },
  { id: '6', nom: 'Les appareils d\'appui', type: 'standard' },
  { id: '7', nom: 'Coffrage poutre couronnement', type: 'standard' },
  { id: '8', nom: 'Autre', type: 'autre' }
];

const STATIONS_INITIALES: Station[] = [
  { id: '1', nom: 'TS 07', modele: 'Station Totale TS 07', numero: 'TS007', statut: 'disponible' },
  { id: '2', nom: 'TS 06 PLUS', modele: 'Station Totale TS 06 PLUS', numero: 'TS006P', statut: 'disponible' },
  { id: '3', nom: 'TS 11', modele: 'Station Totale TS 11', numero: 'TS011', statut: 'disponible' }
];

const USERS_INITIAUX: User[] = [
  {
    id: 'admin-1',
    nom: 'Akram',
    motDePasse: 'akram2025',
    role: 'admin',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 'topo-1',
    nom: 'Akram',
    motDePasse: 'akram123',
    role: 'topographe',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 'topo-2',
    nom: 'Bachir',
    motDePasse: 'bachir123',
    role: 'topographe',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 'topo-3',
    nom: 'Mohammed',
    motDePasse: 'mohammed123',
    role: 'topographe',
    actif: true,
    dateCreation: new Date().toISOString()
  },
  {
    id: 'topo-4',
    nom: 'Salah',
    motDePasse: 'salah123',
    role: 'topographe',
    actif: true,
    dateCreation: new Date().toISOString()
  }
];

// Fonctions utilitaires
export const initializeData = () => {
  // Toujours réinitialiser les utilisateurs pour s'assurer qu'ils sont corrects
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USERS_INITIAUX));
  
  if (!localStorage.getItem(STORAGE_KEYS.PHASES)) {
    localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(PHASES_INITIALES));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(STATIONS_INITIALES));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PROJETS)) {
    localStorage.setItem(STORAGE_KEYS.PROJETS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.RAPPORTS)) {
    localStorage.setItem(STORAGE_KEYS.RAPPORTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ACTION_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.ACTION_LOGS, JSON.stringify([]));
  }
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : USERS_INITIAUX;
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Projets
export const getProjets = (): Projet[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROJETS);
  return data ? JSON.parse(data) : [];
};

export const saveProjets = (projets: Projet[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJETS, JSON.stringify(projets));
};

// Phases
export const getPhases = (): Phase[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PHASES);
  return data ? JSON.parse(data) : PHASES_INITIALES;
};

export const savePhases = (phases: Phase[]) => {
  localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(phases));
};

// Stations
export const getStations = (): Station[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STATIONS);
  return data ? JSON.parse(data) : STATIONS_INITIALES;
};

export const saveStations = (stations: Station[]) => {
  localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
};

// Rapports
export const getRapports = (): Rapport[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RAPPORTS);
  return data ? JSON.parse(data) : [];
};

export const saveRapports = (rapports: Rapport[]) => {
  localStorage.setItem(STORAGE_KEYS.RAPPORTS, JSON.stringify(rapports));
};

export const addRapport = (rapport: Rapport) => {
  const rapports = getRapports();
  rapports.push(rapport);
  saveRapports(rapports);
};

// Action Logs
export const getActionLogs = (): ActionLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTION_LOGS);
  return data ? JSON.parse(data) : [];
};

export const addActionLog = (log: Omit<ActionLog, 'id' | 'timestamp'>) => {
  const logs = getActionLogs();
  const newLog: ActionLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...log
  };
  logs.push(newLog);
  localStorage.setItem(STORAGE_KEYS.ACTION_LOGS, JSON.stringify(logs));
};