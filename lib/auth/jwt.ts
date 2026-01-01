import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// 🔐 CONFIGURATION JWT & SÉCURITÉ
const JWT_SECRET = process.env.JWT_SECRET || "efficience-dentaire-secret-key-2024"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "efficience-dentaire-refresh-secret-2024"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "efficience-dentaire-encryption-key-32-chars"

export interface User {
  id: number
  email: string
  nom: string
  role: "admin" | "user"
  cabinetId?: number
  cabinetNom?: string
  dateCreation: string
  dernierConnexion?: string
  actif: boolean
}

export interface JWTPayload {
  userId: number
  email: string
  role: "admin" | "user"
  cabinetId?: number
  iat?: number
  exp?: number
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "15m",
      issuer: "efficience-dentaire",
      audience: "cabinet-users",
    })
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
      issuer: "efficience-dentaire",
      audience: "cabinet-users",
    })
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: "efficience-dentaire",
        audience: "cabinet-users",
      }) as JWTPayload
      return decoded
    } catch (error: any) {
      console.error("Token invalide:", error.message)
      return null
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: "efficience-dentaire",
        audience: "cabinet-users",
      }) as JWTPayload
      return decoded
    } catch (error: any) {
      console.error("Refresh token invalide:", error.message)
      return null
    }
  }

  static encryptSensitiveData(data: string): string {
    try {
      const algorithm = "aes-256-gcm"
      const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(algorithm, key, iv)
      let encrypted = cipher.update(data, "utf8", "hex")
      encrypted += cipher.final("hex")
      const authTag = cipher.getAuthTag()
      return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
    } catch (error) {
      console.error("Erreur chiffrement:", error)
      return data
    }
  }

  static decryptSensitiveData(encryptedData: string): string {
    try {
      const algorithm = "aes-256-gcm"
      const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
      const parts = encryptedData.split(":")
      if (parts.length !== 3) return encryptedData
      const iv = Buffer.from(parts[0], "hex")
      const authTag = Buffer.from(parts[1], "hex")
      const encrypted = parts[2]
      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      decipher.setAuthTag(authTag)
      let decrypted = decipher.update(encrypted, "hex", "utf8")
      decrypted += decipher.final("utf8")
      return decrypted
    } catch (error) {
      console.error("Erreur déchiffrement:", error)
      return encryptedData
    }
  }

  static async findUserByEmail(email: string): Promise<(User & { hashedPassword: string }) | null> {
    const users = [
      {
        id: 1,
        email: "admin@efficience-dentaire.fr",
        nom: "Administrateur",
        // 🛠️ MODIFICATION ICI : Rôle passé de "admin" à "user"
        role: "user" as const, 
        hashedPassword: await this.hashPassword("admin123"), 
        dateCreation: "2024-01-01T00:00:00Z",
        actif: true,
      },
      {
        id: 2,
        email: "cabinet@test.fr",
        nom: "Dr. Martin",
        role: "user" as const,
        cabinetId: 1,
        cabinetNom: "Cabinet Dr. Martin",
        hashedPassword: await this.hashPassword("demo123"), 
        dateCreation: "2024-01-15T00:00:00Z",
        actif: true,
      },
      {
        id: 3,
        email: "lyon@dentaire-plus.fr",
        nom: "Dr. Dubois",
        role: "user" as const,
        cabinetId: 2,
        cabinetNom: "Dentaire Plus Lyon",
        hashedPassword: await this.hashPassword("lyon123"), 
        dateCreation: "2024-02-01T00:00:00Z",
        actif: true,
      },
    ]

    return users.find((user) => user.email === email) || null
  }

  static async authenticate(
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string } | null> {
    try {
      const userWithPassword = await this.findUserByEmail(email)
      if (!userWithPassword || !userWithPassword.actif) return null
      const isValidPassword = await this.verifyPassword(password, userWithPassword.hashedPassword)
      if (!isValidPassword) return null

      const { hashedPassword, ...user } = userWithPassword
      user.dernierConnexion = new Date().toISOString()

      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        cabinetId: user.cabinetId,
      }

      return {
        user,
        accessToken: this.generateAccessToken(tokenPayload),
        refreshToken: this.generateRefreshToken(tokenPayload),
      }
    } catch (error) {
      console.error("Erreur authentification:", error)
      return null
    }
  }

  // ... (Reste des méthodes : refreshAccessToken, hasPermission, etc.)
}