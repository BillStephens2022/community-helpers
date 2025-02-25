import mongoose from "mongoose";
// even though not explicitly used in this file, it is needed so that Message model 
// is registered before using it to populate messages.  Will get errors on profile 3
// page if import isn't here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Message from './Message'; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Contract from './Contract';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  isWorker: { 
    type: Boolean, 
    default: false 
  },
  skillset: { 
    type: String, 
    trim: true 
  },
  aboutText: { 
    type: String, 
    trim: true 
  },
  skills: [{ 
    type: String 
  }],
  profileImage: { 
    type: String 
  },
  walletBalance: { 
    type: Number, 
    default: 0 
  },
  sentMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  receivedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  contracts: [{ type: Schema.Types.ObjectId, ref: 'Contract' }],
  services: [{
    service: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rateType: { type: String, required: true, enum: ['flat', 'hourly'] },
  }],
  reviews: [{
    reviewText: { type: String, required: true, trim: true },
    reviewRating: { type: Number, required: true, min: 1, max: 5 },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
