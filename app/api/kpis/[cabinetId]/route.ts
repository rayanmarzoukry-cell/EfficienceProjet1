// app/api/kpis/[cabinetId]/route.ts

import { NextResponse } from "next/server";
import KpiResultModel from "@/models/KpiResult";
import { initializeApp } from "@/lib/db";
import { format } from "date-fns";


export const dynamic = "force-dynamic";

const groupKpis = (results: any[]) => {
  const groupedKpis: Record<
    string,
    { valeur: number; score: string; reco: string; cible: number }
  > = {};
  results.forEach((r) => {
    groupedKpis[r.kpiName] = {
      valeur: r.valeurReelle,
      score: r.scoreEvaluation,
      reco: r.recommandation,
      cible: r.seuilCible,
    };
  });
  return groupedKpis;
};

export async function GET(
  request: Request,
  context: { params: { cabinetId: string } }
) {
  try {
    const cabinetId = context.params.cabinetId;

    await initializeApp();

    const today = new Date();
    const targetDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1, 0, 0, 0, 0)
    );

    const kpiResults = await KpiResultModel.find({
      cabinetId,
      moisAnalyse: { $gte: targetDate },
    })
      .select(
        "kpiName valeurReelle seuilCible scoreEvaluation recommandation"
      )
      .lean();

    if (!kpiResults || kpiResults.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: `Aucun résultat d'analyse trouvé pour le cabinet '${cabinetId}' pour la période ${format(
            targetDate,
            "yyyy-MM"
          )}.`,
          cabinetId,
          resultsCount: 0,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const groupedKpis = groupKpis(kpiResults);

    return NextResponse.json({
      cabinetId,
      mois: format(targetDate, "yyyy-MM"),
      resultsCount: kpiResults.length,
      kpis: groupedKpis,
      message: "KPIs récupérés avec succès",
    });
  } catch (error: any) {
    console.error("API Error fetching KPIs:", error);
    return new NextResponse(
      JSON.stringify({
        message: `Erreur serveur lors de la récupération des KPIs. (Détail: ${
          error.message || "Erreur inconnue"
        })`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
