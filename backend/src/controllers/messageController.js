import mongoose from "mongoose";
import Message from "../models/Message.js";
import Connection from "../models/Connection.js";

const sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;

        if (!receiver || !text) {
            return res.status(400).json({
                message: "Receiver and message text are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({
                message: "Invalid receiver ID"
            });
        }

        const connection = await Connection.findOne({
            status: "Accepted",
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

        if (!connection) {
            return res.status(403).json({
                message: "You can message only accepted connections"
            });
        }

        const message = new Message({
            sender: req.user.id,
            receiver,
            text
        });

        await message.save();

        return res.status(201).json({
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const connection = await Connection.findOne({
            status: "Accepted",
            $or: [
                {
                    sender: req.user.id,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: req.user.id
                }
            ]
        });

        if (!connection) {
            return res.status(403).json({
                message: "You can view messages only with accepted connections"
            });
        }

        const messages = await Message.find({
            $or: [
                {
                    sender: req.user.id,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: req.user.id
                }
            ]
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            messages
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export default {
    sendMessage,
    getConversation
};