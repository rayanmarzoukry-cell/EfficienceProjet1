import { type NextRequest, NextResponse } from "next/server"
import { AuthService, type JWTPayload } from "@/lib/auth/jwt"

// 🛡️ MIDDLEWARE D'AUTHENTIFICATION
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export function createAuthMiddleware(requiredRole?: "admin" | "user") {
  return async function authMiddleware(request: NextRequest): Promise<NextResponse | void> {
    try {
      // Récupérer le token depuis les headers
      const authHeader = request.headers.get("authorization")
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

      if (!token) {
        return NextResponse.json({ success: false, error: "Token d'authentification requis" }, { status: 401 })
      }

      // Vérifier le token
      const payload = AuthService.verifyAccessToken(token)

      if (!payload) {
        return NextResponse.json({ success: false, error: "Token invalide ou expiré" }, { status: 401 })
      }

      // Vérifier les permissions si un rôle est requis
      if (requiredRole && !AuthService.hasPermission(payload.role, requiredRole)) {
        return NextResponse.json({ success: false, error: "Permissions insuffisantes" }, { status: 403 })
      }
      // Ajouter les informations utilisateur à la requête
      ;(request as AuthenticatedRequest).user = payload

      // Continuer vers la route suivante
      return NextResponse.next()
    } catch (error) {
      console.error("Erreur middleware auth:", error)
      return NextResponse.json({ success: false, error: "Erreur d'authentification" }, { status: 500 })
    }
  }
}

// 🔒 Middleware pour routes admin uniquement
export const adminOnlyMiddleware = createAuthMiddleware("admin")

// 👤 Middleware pour routes utilisateur (admin ou user)
export const userMiddleware = createAuthMiddleware("user")

// 🔓 Middleware pour vérifier l'authentification sans restriction de rôle
export const authMiddleware = createAuthMiddleware()

// 🏢 Middleware pour vérifier l'accès au cabinet
export function createCabinetAccessMiddleware() {
  return async function cabinetAccessMiddleware(request: NextRequest, cabinetId: number): Promise<NextResponse | void> {
    const user = (request as AuthenticatedRequest).user

    if (!user) {
      return NextResponse.json({ success: false, error: "Authentification requise" }, { status: 401 })
    }

    // Récupérer les informations utilisateur complètes
    const fullUser = await AuthService.findUserByEmail(user.email)

    if (!fullUser || !AuthService.canAccessCabinet(fullUser, cabinetId)) {
      return NextResponse.json({ success: false, error: "Accès au cabinet non autorisé" }, { status: 403 })
    }

    return NextResponse.next()
  }
}
