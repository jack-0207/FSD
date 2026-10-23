import mongoose from 'mongoose';

const testRecordSchema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    testName: { type: String, required: true },
    testType: {
      type: String,
      enum: ['Chemical', 'Microbial', 'Physical', 'Sensory'],
      required: true,
    },
    result: { type: String, required: true },
    passed: { type: Boolean, default: false },
    technician: { type: String, required: true },
    notes: { type: String },
    testDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('TestRecord', testRecordSchema);
