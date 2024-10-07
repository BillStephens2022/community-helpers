const mongoose = require("mongoose");
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
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
