import User from "../models/User.js";
import Startup from "../models/Startup.js";
import Connection from "../models/Connection.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";

const getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const startup = await Startup.findOne({
            founder: req.user.id
        });

        const connectionRequests = await Connection.countDocuments({
            receiver: req.user.id,
            status: "Pending"
        });

        const acceptedConnections = await Connection.countDocuments({
            status: "Accepted",
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        });

        const messages = await Message.countDocuments({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        });

        const tasks = startup
            ? await Task.find({
                startup: startup._id
            })
                .sort({ createdAt: -1 })
                .limit(5)
            : [];

        return res.status(200).json({
            dashboard: {
                user,
                startup,
                stats: {
                    connectionRequests,
                    acceptedConnections,
                    messages,
                    startupProgress: startup
                        ? startup.progress
                        : 0,
                    totalTasks: startup
                        ? await Task.countDocuments({
                            startup: startup._id
                        })
                        : 0
                },
                recentTasks: tasks
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default {
    getDashboard
};