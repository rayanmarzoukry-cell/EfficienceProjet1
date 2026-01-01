'use client';

import React from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { DashboardOverview } from '@/components/dashboard-overview';
import { CabinetsTable } from '@/components/cabinets-table';
import { ReportsHistory } from '@/components/reports-history';
// Import de votre nouveau travail (KPIs MongoDB)
// Le "../" sert à sortir du dossier admin pour aller chercher le dossier dashboard
import DashboardPage from '../dashboard/page'; 

export default function AdminPage() {
  return (
    <ProtectedLayout 
      title="Administration" 
      subtitle="Efficience-Dentaire"
    >
      <div className="space-y-10 pb-12">
        
        {/* 1. LES GRAPHIQUES ORIGINAUX (Capture 2) */}
        <section>
          <DashboardOverview />
        </section>

        {/* 2. VOTRE NOUVELLE ANALYSE MONGODB (Capture 4) */}
        <section className="mt-8 border-t pt-8">
          <div className="bg-[#1e293b] rounded-t-xl px-6 py-4 text-white shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📊 Analyse Performance Live (MongoDB)
            </h2>
          </div>
          <div className="bg-white border border-t-0 rounded-b-xl shadow-md p-4">
             <DashboardPage />
          </div>
        </section>

        {/* 3. LES TABLEAUX DE GESTION (Capture 3) */}
        <div className="grid grid-cols-1 gap-8">
          <CabinetsTable />
          <ReportsHistory />
        </div>
            
      </div>
    </ProtectedLayout>
  );
}