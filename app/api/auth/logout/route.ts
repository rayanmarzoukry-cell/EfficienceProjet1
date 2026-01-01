import { type NextRequest, NextResponse } from "next/server"

// 🚪 ROUTE DE DÉCONNEXION
export async function POST(request: NextRequest) {
  try {
    // Créer la réponse de déconnexion
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    })

    // Supprimer le refresh token des cookies
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immédiatement
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erreur déconnexion:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur lors de la déconnexion" }, { status: 500 })
  }
}
