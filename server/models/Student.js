import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, as Excel doesn't provide this
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String }, // Optional, to be set manually or via other data
  year: { type: String }, // Optional
  major: { type: String }, // Optional
  gpa: { type: Number, default: 0 },
  attendance: { type: Number, default: 0 },
  status: { type: String, enum: ['On Track', 'At Risk', 'Critical'], default: 'On Track' },
  marks: [{ subject: String, score: Number }], // Can store parsed marks from Excel
  goals: [{ description: String, progress: Number }],
  sessionNotes: [{ date: Date, content: String }],
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
  flags: [{ type: String }],
  // Fields from studentsData.xlsx
  se: { type: String }, // Software Engineering
  padcom: { type: String }, // PADCOM
  cns: { type: String }, // Computer Networks Security
  clsa: { type: String }, // CLSA
  tdfsdiii: { type: String }, // TDFSDIII
  iic: { type: String }, // IIC
  seLab: { type: String },
  cnsLab: { type: String },
  adsLab: { type: String },
  ajpLab: { type: String },
  qalr: { type: String },
  ads: { type: String },
  ajp: { type: String },
  npteloe: { type: String },
  idpii: { type: String },
  cepb: { type: String },
  csevac: { type: String },
  library: { type: String },
  counseling: { type: String },
  totalPercentage: { type: Number },
  phoneNumber: { type: String },
  parentNumber: { type: String },
});

export default mongoose.model('Student', studentSchema);