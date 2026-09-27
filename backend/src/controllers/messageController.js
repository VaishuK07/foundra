import Message from "../models/Message.js";

const sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;

        if (!receiver || !text) {
            return res.status(400).json({
                message: "Receiver and message text are required"
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