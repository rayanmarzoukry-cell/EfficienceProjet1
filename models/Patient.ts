import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateRDV: { type: Date, required: true },
  time: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['CONTRÔLE', 'DÉTARTRAGE', 'DÉVITALISATION', 'IMPLANT'],
    required: true 
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'ATTENTE'],
    default: 'ATTENTE'
  },
  phone: String,
  email: String,
  cabinetId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Patient = (mongoose.models && mongoose.models.Patient) 
  ? mongoose.models.Patient 
  : mongoose.model('Patient', PatientSchema, 'patients');

export default Patient;
