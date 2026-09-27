import User from "../models/User.js";
import Startup from "../models/Startup.js";

const findCoFounders = async (req, res) => {
    try {
        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        const users = await User.find({
            _id: { $ne: req.user.id },
            role: "founder"
        }).select("-password");

        const requiredSkills = startup.skillsNeeded.map(skill =>
            skill.toLowerCase()
        );

        const recommendations = users.map(user => {
            const userSkills = user.skills.map(skill =>
                skill.toLowerCase()
            );

            const matchedSkills = userSkills.filter(skill =>
                requiredSkills.includes(skill)
            );

            const matchPercentage =
                requiredSkills.length === 0
                    ? 0
                    : Math.round(
                        (matchedSkills.length / requiredSkills.length) * 100
                    );

            return {
                user,
                matchedSkills,
                matchPercentage
            };
        });

        recommendations.sort(
            (a, b) => b.matchPercentage - a.matchPercentage
        );

        return res.status(200).json({
            recommendations
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export default { findCoFounders };