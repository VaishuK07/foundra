
import mongoose from "mongoose";
import User from "../models/User.js";
import Analytics from "../models/Analytics.js";

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const viewerId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Do not count your own profile view.
        if (viewerId !== userId) {
            const now = new Date();

            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(endOfDay.getDate() + 1);

            try {
                await Analytics.findOneAndUpdate(
                    {
                        user: userId,
                        profileViewers: {
                            $not: {
                                $elemMatch: {
                                    viewer: new mongoose.Types.ObjectId(viewerId),
                                    viewedAt: {
                                        $gte: startOfDay,
                                        $lt: endOfDay
                                    }
                                }
                            }
                        }
                    },
                    {
                        $inc: {
                            profileViews: 1
                        },
                        $push: {
                            profileViewers: {
                                viewer: new mongoose.Types.ObjectId(viewerId),
                                viewedAt: now
                            }
                        },
                        $setOnInsert: {
                            user: userId
                        }
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
            } catch (error) {
                // If another request creates the same analytics record
                // concurrently, retry without upsert.
                if (error.code !== 11000) {
                    throw error;
                }

                await Analytics.findOneAndUpdate(
                    {
                        user: userId,
                        profileViewers: {
                            $not: {
                                $elemMatch: {
                                    viewer: new mongoose.Types.ObjectId(viewerId),
                                    viewedAt: {
                                        $gte: startOfDay,
                                        $lt: endOfDay
                                    }
                                }
                            }
                        }
                    },
                    {
                        $inc: {
                            profileViews: 1
                        },
                        $push: {
                            profileViewers: {
                                viewer: new mongoose.Types.ObjectId(viewerId),
                                viewedAt: now
                            }
                        }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );
            }
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error("Get user profile error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default { getUserProfile };
