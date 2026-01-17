import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "admins",
    timestamps: true,
  }
)

// Éviter la réinstanciation du modèle
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema)

export default Admin
