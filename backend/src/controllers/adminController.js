import User from "../models/User.js";
import Startup from "../models/Startup.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalFounders = await User.countDocuments({
            role: "founder"
        });

        const totalInvestors = await User.countDocuments({
            role: "investor"
        });

        const totalStartups = await Startup.countDocuments();

        const totalMessages = await Message.countDocuments();

        const totalTasks = await Task.countDocuments();

        return res.status(200).json({
            stats: {
                totalUsers,
                totalFounders,
                totalInvestors,
                totalStartups,
                totalMessages,
                totalTasks
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default {
    getDashboardStats
};