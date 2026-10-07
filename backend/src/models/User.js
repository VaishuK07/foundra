import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100
        },

        role: {
            type: String,
            enum: ["founder", "investor", "admin"],
            default: "founder"
        },

        skills: {
            type: [String],
            default: [],
            validate: {
                validator: function (skills) {
                    return (
                        skills.length <= 20 &&
                        skills.every(
                            skill =>
                                typeof skill === "string" &&
                                skill.trim().length > 0 &&
                                skill.trim().length <= 50
                        )
                    );
                },
                message: "Maximum 20 skills allowed and each skill must be 1-50 characters"
            }
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        profileImage: {
            type: String,
            trim: true,
            maxlength: 2000,
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
    }
);

export default mongoose.model("User", userSchema);