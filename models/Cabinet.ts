import mongoose from 'mongoose';

const CabinetSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  score: { type: Number, default: 0, min: 0, max: 100 },
  statut: {
    type: String,
    enum: ['performant', 'surveiller', 'alerte'],
    default: 'performant'
  },
  caActuel: { type: Number, default: 0 },
  caObjectif: { type: Number, default: 0 },
  trend: { type: String, default: '+0%' },
  rapport: { type: String, default: 'À générer' },
  rapportStatut: {
    type: String,
    enum: ['pending', 'sent', 'draft'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Cabinet = (mongoose.models && mongoose.models.Cabinet) 
  ? mongoose.models.Cabinet 
  : mongoose.model('Cabinet', CabinetSchema, 'cabinets');

export default Cabinet;
