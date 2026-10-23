import mongoose from 'mongoose';

const complianceReportSchema = new mongoose.Schema(
  {
    reportNumber: { type: String, required: true, unique: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    regulation: { type: String, required: true },
    status: {
      type: String,
      enum: ['Compliant', 'Action Required', 'Non-Compliant'],
      default: 'Compliant',
    },
    generatedBy: { type: String, required: true },
    summary: { type: String },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('ComplianceReport', complianceReportSchema);
