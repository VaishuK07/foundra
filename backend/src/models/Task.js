import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 150
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        startup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Startup",
            required: true,
            index: true
        },

        dueDate: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Task", taskSchema);