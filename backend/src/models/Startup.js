import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        domain: {
            type: String,
            required: true,
            trim: true
        },

        stage: {
            type: String,
            enum: [
                "Idea",
                "Research",
                "Prototype",
                "MVP",
                "Launch"
            ],
            default: "Idea"
        },

        location: {
            type: String,
            trim: true
        },

        skillsNeeded: {
            type: [String],
            default: []
        },

        teamMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        founder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Startup", startupSchema);