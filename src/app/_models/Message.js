import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageSubject: { type: String, required: true },
  messageText: { type: String, required: true },
  parentMessage: { type: Schema.Types.ObjectId, ref: 'Message', default: null }, // Self-reference
  replies: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // Child replies
  deletedBySender: { type: Boolean, default: false },
  deletedByReceiver: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', function (next) {
  // Ensure 'from' and 'to' fields are different
  if (this.from.equals(this.to)) {
    return next(new Error("Sender and receiver cannot be the same user."));
  }
  next();
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
