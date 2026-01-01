"use client"
import React, { useState } from 'react'
import { useApp } from "@/context/AppContext"
import { Search, Plus, Calendar, Clock, User, MoreHorizontal, Trash2 } from 'lucide-react'

export default function PatientsPage() {
  const { patients, refreshData, loading, addPatient, deletePatient, updatePatient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: '', dateRDV: '', time: '', type: 'CONTRÔLE', email: '', phone: '' });

  // Filtrage des patients pour la recherche
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de l'ajout via le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPatient(form);
    setShowModal(false);
    setForm({ name: '', dateRDV: '', time: '', type: 'CONTRÔLE', email: '', phone: '' });
  };

  // Badge de couleur selon le type
  const getTypeBadge = (type: string) => {
    const colors: any = {
      'ORTHODONTIE': 'bg-purple-100 text-purple-700',
      'DÉTARTRAGE': 'bg-blue-100 text-blue-700',
      'IMPLANT': 'bg-emerald-100 text-emerald-700',
      'CARIE': 'bg-orange-100 text-orange-700',
      'CONTRÔLE': 'bg-slate-100 text-slate-700'
    };
    return colors[type] || colors['CONTRÔLE'];
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Planning Cabinet</h1>
          <p className="text-slate-500 font-medium">{patients.length} patients enregistrés</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un nom..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus size={20} /> NOUVEAU
          </button>
        </div>
      </div>

      {/* TABLEAU DES PATIENTS */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-widest">Patient</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-widest">Date & Heure</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-widest">Type de Soin</th>
              <th className="px-6 py-4 font-bold uppercase text-xs tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-10 text-center text-slate-400">Chargement des données...</td></tr>
            ) : filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase">
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase text-sm">{patient.name}</p>
                      <p className="text-xs text-slate-500">{patient.phone || '06 XX XX XX XX'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Calendar size={14} className="text-blue-500" /> {patient.dateRDV}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Clock size={14} /> {patient.time}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeBadge(patient.type)}`}>
                    {patient.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* BOUTON MODIFIER */}
                    <button 
                      onClick={() => {
                        const newName = prompt("Modifier le nom du patient :", patient.name);
                        if (newName) updatePatient(patient.id, { ...patient, name: newName.toUpperCase() });
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {/* BOUTON SUPPRIMER */}
                    <button 
                      onClick={() => deletePatient(patient.id)}
                      className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL D'AJOUT */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-6 text-slate-900 flex items-center gap-2">
               <User className="text-blue-600" /> Nouveau Patient
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Nom Complet</label>
                <input 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500" 
                  placeholder="NOM DU PATIENT" 
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required 
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Date</label>
                  <input type="date" className="w-full bg-slate-50 border-none p-4 rounded-2xl" onChange={e => setForm({...form, dateRDV: e.target.value})} required />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Heure</label>
                  <input type="time" className="w-full bg-slate-50 border-none p-4 rounded-2xl" onChange={e => setForm({...form, time: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-2">Type de Consultation</label>
                <select 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl font-semibold"
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option value="CONTRÔLE">CONTRÔLE</option>
                  <option value="DÉTARTRAGE">DÉTARTRAGE</option>
                  <option value="ORTHODONTIE">ORTHODONTIE</option>
                  <option value="IMPLANT">IMPLANT</option>
                  <option value="CARIE">CARIE</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                ENREGISTRER LE PATIENT
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="w-full py-2 text-slate-400 font-semibold text-sm">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}