import mongoose from "mongoose"

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["import_data", "create_admin", "update_admin", "delete_admin", "export_data", "view_stats"],
      required: true,
    },
    resource: {
      type: String,
      enum: ["patients", "cabinets", "rendezvous", "admins", "settings"],
    },
    status: {
      type: String,
      enum: ["success", "error", "pending"],
      default: "pending",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    recordsAffected: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    fileInfo: {
      fileName: String,
      fileSize: Number,
      rows: Number,
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: "audit_logs",
    timestamps: true,
  }
)

// Créer index pour optimiser les recherches
AuditLogSchema.index({ adminEmail: 1, timestamp: -1 })
AuditLogSchema.index({ action: 1, timestamp: -1 })

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema)

export default AuditLog
