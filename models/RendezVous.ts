import mongoose from 'mongoose';

const RendezVousSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  cabinetId: { type: String, required: true, index: true },
  dateRDV: { type: Date, required: true },
  time: { type: String, required: true },
  type: {
    type: String,
    enum: ['CONTRÔLE', 'DÉTARTRAGE', 'DÉVITALISATION', 'IMPLANT'],
    required: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
    default: 'SCHEDULED'
  },
  duration: { type: Number, default: 30 }, // minutes
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RendezVous = (mongoose.models && mongoose.models.RendezVous) 
  ? mongoose.models.RendezVous 
  : mongoose.model('RendezVous', RendezVousSchema, 'rendezvous');

export default RendezVous;
