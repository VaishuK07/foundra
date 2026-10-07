import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Stores the two user IDs in a consistent order.
        // This helps prevent A -> B and B -> A duplicates.
        connectionKey: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);


// Automatically create a consistent connection key
connectionSchema.pre("validate", function (next) {
    if (!this.sender || !this.receiver) {
        return next();
    }

    const ids = [
        this.sender.toString(),
        this.receiver.toString()
    ].sort();

    this.connectionKey = `${ids[0]}_${ids[1]}`;

    next();
});


export default mongoose.model("Connection", connectionSchema);