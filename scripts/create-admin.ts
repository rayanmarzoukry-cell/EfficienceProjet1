#!/usr/bin/env node

/**
 * Script d'initialisation des comptes admin
 * 
 * Usage:
 *   npx ts-node scripts/create-admin.ts
 * 
 * Crée le compte admin par défaut dans MongoDB
 */

import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

// Importer le modèle Admin
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["super-admin", "admin", "moderator"], default: "admin" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "admins", timestamps: true }
)

async function createDefaultAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI non défini dans .env.local")
      process.exit(1)
    }

    console.log("🔌 Connexion à MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connecté à MongoDB")

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({
      email: "admin@efficience-dentaire.fr",
    })

    if (existingAdmin) {
      console.log("⚠️  L'administrateur par défaut existe déjà")
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Nom: ${existingAdmin.name}`)
      console.log(`   Rôle: ${existingAdmin.role}`)
      await mongoose.disconnect()
      process.exit(0)
    }

    // Créer l'admin par défaut
    const admin = new Admin({
      email: "admin@efficience-dentaire.fr",
      passwordHash: "Efficience2026!", // À hasher avec bcrypt en production
      name: "Administrateur Efficience",
      role: "super-admin",
      isActive: true,
    })

    await admin.save()

    console.log("✅ Administrateur par défaut créé avec succès!")
    console.log("")
    console.log("📋 Informations de connexion:")
    console.log("   Email: admin@efficience-dentaire.fr")
    console.log("   Mot de passe: Efficience2026!")
    console.log("   Rôle: super-admin")
    console.log("")
    console.log("⚠️  IMPORTANT: Changez ces credentials en production!")
    console.log("")

    // Afficher tous les admins
    const allAdmins = await Admin.find({}, { passwordHash: 0 })
    console.log("📊 Tous les administrateurs:")
    console.table(
      allAdmins.map((a: any) => ({
        Email: a.email,
        Nom: a.name,
        Rôle: a.role,
        Actif: a.isActive ? "✅" : "❌",
        "Créé le": new Date(a.createdAt).toLocaleString("fr-FR"),
      }))
    )

    await mongoose.disconnect()
    console.log("\n✅ Déconnecté de MongoDB")
    process.exit(0)
  } catch (error) {
    console.error("❌ Erreur:", error)
    process.exit(1)
  }
}

createDefaultAdmin()
