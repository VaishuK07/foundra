import mongoose from "mongoose";
import Connection from "../models/Connection.js";
import User from "../models/User.js";

const sendRequest = async (req, res) => {
    try {
        const { receiver } = req.body;

        if (!receiver) {
            return res.status(400).json({
                message: "Receiver is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({
                message: "Invalid receiver ID"
            });
        }

        if (receiver === req.user.id) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        const user = await User.findById(receiver);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingConnection = await Connection.findOne({
            $or: [
                {
                    sender: req.user.id,
                    receiver
                },
                {
                    sender: receiver,
                    receiver: req.user.id
                }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        const connection = new Connection({
            sender: req.user.id,
            receiver
        });

        await connection.save();

        return res.status(201).json({
            message: "Connection request sent successfully",
            connection
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getRequests = async (req, res) => {
    try {
        const requests = await Connection.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
            .populate("sender", "name email skills bio profileImage")
            .populate("receiver", "name email skills bio profileImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            requests
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getAcceptedConnections = async (req, res) => {
    try {
        const connections = await Connection.find({
            status: "Accepted",
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
            .populate("sender", "name email skills bio profileImage")
            .populate("receiver", "name email skills bio profileImage")
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            connections
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const updateRequestStatus = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(connectionId)) {
            return res.status(400).json({
                message: "Invalid connection ID"
            });
        }

        if (!["Accepted", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Accepted or Rejected"
            });
        }

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({
                message: "Connection request not found"
            });
        }

        if (connection.receiver.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this request"
            });
        }

        if (connection.status !== "Pending") {
            return res.status(400).json({
                message: "This connection request has already been processed"
            });
        }

        connection.status = status;

        await connection.save();

        return res.status(200).json({
            message: `Connection request ${status.toLowerCase()} successfully`,
            connection
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export default {
    sendRequest,
    getRequests,
    getAcceptedConnections,
    updateRequestStatus
};