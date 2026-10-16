
import Analytics from "../models/Analytics.js";
import Startup from "../models/Startup.js";
import Message from "../models/Message.js";
import Connection from "../models/Connection.js";

const getAnalytics = async (req, res) => {
    try {
        let analytics = await Analytics.findOne({
            user: req.user.id
        });

        if (!analytics) {
            analytics = new Analytics({
                user: req.user.id
            });
        }

        const startup = await Startup.findOne({
            founder: req.user.id
        });

        const messageCount = await Message.countDocuments({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        });

        const requestCount = await Connection.countDocuments({
            receiver: req.user.id,
            status: "Pending"
        });

        const matchCount = await Connection.countDocuments({
            status: "Accepted",
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        });

        analytics.startupProgress = startup
            ? startup.progress
            : 0;

        analytics.messages = messageCount;
        analytics.connectionRequests = requestCount;
        analytics.matches = matchCount;

        await analytics.save();

        return res.status(200).json({
            analytics
        });

    } catch (error) {
        console.error("Get analytics error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateAnalytics = async (req, res) => {
    return res.status(403).json({
        message: "Analytics metrics are calculated automatically"
    });
};

const recordProfileView = async (req, res) => {
    try {
        let analytics = await Analytics.findOne({
            user: req.user.id
        });

        if (!analytics) {
            analytics = new Analytics({
                user: req.user.id
            });
        }

        analytics.profileViews += 1;

        await analytics.save();

        return res.status(200).json({
            message: "Profile view recorded",
            profileViews: analytics.profileViews
        });

    } catch (error) {
        console.error("Record profile view error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default {
    getAnalytics,
    updateAnalytics,
    recordProfileView
};
