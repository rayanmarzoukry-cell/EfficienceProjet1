"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function MapCard() {
  return (
    <Card className="overflow-hidden shadow-lg border-none bg-white">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-lg font-semibold">Localisation du Cabinet</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[450px] relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.148154807963!2d10.175869175231782!3d36.79900536854181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3570e288e43d%3A0xbaf5097886a2450b!2sEfficience-dentaire!5e0!3m2!1sfr!2stn!4v1715600000000!5m2!1sfr!2stn" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Efficience Dentaire"
          />
        </div>
        <div className="p-4 bg-slate-50 border-t">
          <p className="text-sm font-medium text-slate-700">3 Rue Jamel Abdenasser, Tunis 1000</p>
          <p className="text-xs text-slate-500">Contact : +216 55 980 474</p>
        </div>
      </CardContent>
    </Card>
  )
}