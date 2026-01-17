"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

// 1. Définition de la structure d'un patient
interface Patient {
  id: string | number;
  name: string;
  dateRDV: string;
  time: string;
  type: string;
  status?: string;
  phone?: string;
  email?: string;
}

// 2. Définition des fonctions et états partagés
interface AppContextType {
  patients: Patient[];
  loading: boolean;
  isServerOnline: boolean;
  refreshData: () => Promise<void>;
  addPatient: (patientData: any) => Promise<void>;
  deletePatient: (id: string | number) => Promise<void>;
  updatePatient: (id: string | number, updatedData: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null)

// Données par défaut si le serveur Flask est hors ligne
const defaultPatients: Patient[] = [
  { id: 1, name: "Jean Dupont", dateRDV: "2026-01-15", time: "09:00", type: "CONTRÔLE", status: "PRESENT" },
  { id: 2, name: "Marie Martin", dateRDV: "2026-01-15", time: "09:30", type: "DÉTARTRAGE", status: "PRESENT" },
  { id: 3, name: "Pierre Bernard", dateRDV: "2026-01-15", time: "10:00", type: "DÉTARTRAGE", status: "ATTENTE" },
  { id: 4, name: "Sophie Lefevre", dateRDV: "2026-01-15", time: "10:30", type: "DÉVITALISATION", status: "PRESENT" },
  { id: 5, name: "Luc Durand", dateRDV: "2026-01-15", time: "11:00", type: "CONTRÔLE", status: "ABSENT" },
  { id: 6, name: "Anne Dubois", dateRDV: "2026-01-16", time: "14:00", type: "IMPLANT", status: "PRESENT" },
  { id: 7, name: "Marc Garnier", dateRDV: "2026-01-16", time: "14:30", type: "DÉTARTRAGE", status: "PRESENT" },
  { id: 8, name: "Isabelle Moreau", dateRDV: "2026-01-16", time: "15:00", type: "DÉVITALISATION", status: "ATTENTE" },
  { id: 9, name: "Nicolas Fournier", dateRDV: "2026-01-16", time: "15:30", type: "CONTRÔLE", status: "PRESENT" },
  { id: 10, name: "Valérie Simon", dateRDV: "2026-01-16", time: "16:00", type: "DÉTARTRAGE", status: "PRESENT" },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(defaultPatients)
  const [loading, setLoading] = useState(true)
  const [isServerOnline, setIsServerOnline] = useState(false)

  const API_URL = "http://127.0.0.1:5001/api";

  // --- ACTION : LIRE (GET) depuis MongoDB via l'API Next.js ---
  const refreshData = useCallback(async () => {
    try {
      // Essayer d'abord l'API MongoDB (Next.js)
      const response = await fetch('/api/patients', {
        cache: 'no-store',
      });
      const data = await response.json();
      
      if (response.ok && Array.isArray(data.patients)) {
        // Déduplique les patients par ID pour éviter les doublons
        const uniquePatients = Array.from(
          new Map(data.patients.map((p: any) => [p.id || (p as any)._id, p])).values()
        ) as Patient[];
        setPatients(uniquePatients);
        setIsServerOnline(true);
        console.log('✅ Données chargées depuis MongoDB');
      } else {
        throw new Error('Données invalides de MongoDB');
      }
    } catch (error) {
      console.warn("⚠️ MongoDB hors ligne ou erreur - Utilisation des données par défaut");
      setPatients(defaultPatients);
      setIsServerOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial et rafraîchissement automatique
  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 5000) // Vérifie les changements toutes les 5 sec
    return () => clearInterval(interval)
  }, [refreshData])

  // --- ACTION : AJOUTER (POST) ---
  const addPatient = async (patientData: any) => {
    try {
      // Génère un ID unique basé sur le timestamp
      const newId = Date.now().toString()
      const patientWithId = { ...patientData, id: newId }
      
      const res = await fetch(`${API_URL}/add-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientWithId)
      })
      if (res.ok) await refreshData()
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err)
    }
  }

  // --- ACTION : SUPPRIMER (DELETE) ---
  const deletePatient = async (id: string | number) => {
    if (!window.confirm("❗ Confirmer la suppression définitive de ce patient ?")) return;
    try {
      const res = await fetch(`${API_URL}/delete-patient/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await refreshData()
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err)
    }
  }

  // --- ACTION : MODIFIER (PUT) ---
  const updatePatient = async (id: string | number, updatedData: any) => {
    try {
      const res = await fetch(`${API_URL}/update-patient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      if (res.ok) {
        await refreshData()
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err)
    }
  }

  return (
    <AppContext.Provider value={{ 
      patients, 
      refreshData, 
      addPatient,
      deletePatient,
      updatePatient,
      loading, 
      isServerOnline 
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook personnalisé pour un accès facile
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp doit être utilisé dans AppProvider")
  return context
}