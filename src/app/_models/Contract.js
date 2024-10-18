import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobCategory: { type: String, required: true },
  jobDescription: { type: String, required: true },
  feeType: { type: String, required: true },
  hourlyRate: { type: Number },
  fixedRate: { type: Number },
  amountDue: { type: Number, required: true },
  additionalNotes: { type: String },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', function (next) {
  // Ensure 'worker' and 'client' fields are different
  if (this.worker.equals(this.client)) {
    return next(new Error("Worker and Client cannot be the same user."));
  }
  next();
});

export default mongoose.models.Contract || mongoose.model('Contract', contractSchema);