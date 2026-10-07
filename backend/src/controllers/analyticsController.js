import Analytics from "../models/Analytics.js";
import Startup from "../models/Startup.js";
import Message from "../models/Message.js";

const getAnalytics = async (req, res) => {
    try {
        let analytics = await Analytics.findOne({
            user: req.user.id
        });

        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!analytics) {
            analytics = new Analytics({
                user: req.user.id
            });
        }

        if (startup) {
            analytics.startupProgress = startup.progress || 0;
        }

        const messageCount = await Message.countDocuments({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        });

        analytics.messages = messageCount;

        await analytics.save();

        return res.status(200).json({
            analytics
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateAnalytics = async (req, res) => {
    try {
        const {
            profileViews,
            connectionRequests,
            matches
        } = req.body;

        let analytics = await Analytics.findOne({
            user: req.user.id
        });

        if (!analytics) {
            analytics = new Analytics({
                user: req.user.id
            });
        }

        if (profileViews !== undefined) {
            analytics.profileViews = profileViews;
        }

        if (connectionRequests !== undefined) {
            analytics.connectionRequests = connectionRequests;
        }

        if (matches !== undefined) {
            analytics.matches = matches;
        }

        await analytics.save();

        return res.status(200).json({
            message: "Analytics updated successfully",
            analytics
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
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