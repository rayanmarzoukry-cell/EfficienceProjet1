import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 🔄 ROUTE DE RENOUVELLEMENT DE TOKEN
export async function POST(request: NextRequest) {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Refresh token manquant" }, { status: 401 })
    }

    // Renouveler les tokens
    const result = await AuthService.refreshAccessToken(refreshToken)

    if (!result) {
      return NextResponse.json({ success: false, error: "Refresh token invalide ou expiré" }, { status: 401 })
    }

    const { accessToken, refreshToken: newRefreshToken } = result

    // Réponse avec le nouveau token d'accès
    const response = NextResponse.json({
      success: true,
      message: "Token renouvelé avec succès",
      data: {
        accessToken,
        expiresIn: 900, // 15 minutes
      },
    })

    // Mettre à jour le refresh token dans les cookies
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erreur renouvellement token:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur lors du renouvellement" }, { status: 500 })
  }
}
