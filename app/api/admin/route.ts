import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // On cherche l'utilisateur dans la collection 'admins' via le modèle Admin
    const user = await Admin.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Vérification du mot de passe (on teste 'password' ou 'passwordHash' selon votre saisie Atlas)
    const isValid = user.password === password || user.passwordHash === password;

    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Mise à jour de la date de dernière connexion (optionnel mais recommandé)
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: "Connexion réussie",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role, // Retourne 'admin' ou 'user'
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Erreur Login:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}


