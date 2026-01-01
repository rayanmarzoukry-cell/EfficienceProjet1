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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isServerOnline, setIsServerOnline] = useState(false)

  const API_URL = "http://127.0.0.1:5001/api";

  // --- ACTION : LIRE (GET) ---
  const refreshData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/get-patients`, {
        cache: 'no-store', // Force le rafraîchissement sans cache
      })
      const data = await response.json()
      if (data.success) {
        setPatients(data.patients)
        setIsServerOnline(true)
      }
    } catch (error) {
      console.warn("☁️ Serveur Flask hors ligne sur le port 5001")
      setIsServerOnline(false)
    } finally {
      setLoading(false)
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
      const res = await fetch(`${API_URL}/add-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
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