import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import AuditLog from "@/models/AuditLog"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "50")
    const action = searchParams.get("action")
    const adminEmail = searchParams.get("adminEmail")

    // Construire le filtre
    const filter: Record<string, any> = {}
    if (action) filter.action = action
    if (adminEmail) filter.adminEmail = adminEmail

    // Récupérer les logs avec pagination
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean()

    // Compter le total
    const total = await AuditLog.countDocuments(filter)

    return NextResponse.json({
      logs,
      total,
      limit,
    })
  } catch (error: any) {
    console.error("❌ Erreur fetch audit logs:", error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      adminEmail,
      action,
      resource,
      status,
      recordsAffected,
      details,
      fileInfo,
      errorMessage,
    } = body

    if (!adminEmail || !action) {
      return NextResponse.json(
        { error: "adminEmail et action requis" },
        { status: 400 }
      )
    }

    const log = new AuditLog({
      adminEmail,
      action,
      resource: resource || null,
      status: status || "success",
      recordsAffected: recordsAffected || 0,
      details: details || {},
      fileInfo: fileInfo || null,
      errorMessage: errorMessage || null,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    await log.save()

    return NextResponse.json({ auditId: log._id }, { status: 201 })
  } catch (error: any) {
    console.error("❌ Erreur création audit log:", error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}
