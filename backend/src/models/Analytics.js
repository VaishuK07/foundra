
import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema(
    {
        viewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        viewedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const analyticsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        profileViews: {
            type: Number,
            default: 0,
            min: 0
        },

        profileViewers: {
            type: [profileViewSchema],
            default: []
        },

        connectionRequests: {
            type: Number,
            default: 0,
            min: 0
        },

        matches: {
            type: Number,
            default: 0,
            min: 0
        },

        messages: {
            type: Number,
            default: 0,
            min: 0
        },

        startupProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Analytics", analyticsSchema);
