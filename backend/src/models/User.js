import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
},
  
    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
},

    password: {
    type: String,
    required: true,
    minlength: 6
},
    role: {
    type: String,
    enum: ["founder", "cofounder", "admin"],
    default: "founder"
},
   skills: {
    type: [String],
    default: []
},
    bio: {
    type: String,
    trim: true,
    maxlength: 500
},
    profileImage: {
    type: String,
    default: ""
},
    createdAt: {
    type: Date,
    default: Date.now
},
    updatedAt: {
    type: Date,
    default: Date.now
}
   
});



export default mongoose.model("User", userSchema);