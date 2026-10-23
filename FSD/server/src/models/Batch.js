import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    supplier: { type: String, required: true },
    productionDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Received', 'In Lab', 'Approved', 'Rejected', 'Hold'],
      default: 'Received',
    },
    quantity: { type: Number, required: true },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
