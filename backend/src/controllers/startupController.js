import Startup from "../models/Startup.js";

const createStartup = async (req, res) => {
    try {
        const {
            name,
            description,
            domain,
            stage,
            location,
            skillsNeeded
        } = req.body;

        if (!name || !description || !domain) {
            return res.status(400).json({
                message: "Name, description and domain are required"
            });
        }

        const startup = new Startup({
            name,
            description,
            domain,
            stage,
            location,
            skillsNeeded,
            founder: req.user.id,
            teamMembers: [req.user.id]
        });

        await startup.save();

        return res.status(201).json({
            message: "Startup created successfully",
            startup
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getMyStartup = async (req, res) => {
    try {
        const startup = await Startup.findOne({
            founder: req.user.id
        }).populate("founder", "name email");

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        return res.status(200).json({
            startup
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const updateMyStartup = async (req, res) => {
    try {
        const {
            name,
            description,
            domain,
            stage,
            location,
            skillsNeeded,
            progress
        } = req.body;

        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        if (name !== undefined) {
            startup.name = name;
        }

        if (description !== undefined) {
            startup.description = description;
        }

        if (domain !== undefined) {
            startup.domain = domain;
        }

        if (stage !== undefined) {
            startup.stage = stage;
        }

        if (location !== undefined) {
            startup.location = location;
        }

        if (skillsNeeded !== undefined) {
            startup.skillsNeeded = skillsNeeded;
        }

        if (progress !== undefined) {
            startup.progress = progress;
        }

        await startup.save();

        return res.status(200).json({
            message: "Startup updated successfully",
            startup
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteMyStartup = async (req, res) => {
    try {
        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        await Startup.findByIdAndDelete(startup._id);

        return res.status(200).json({
            message: "Startup deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


export default {
    createStartup,
    getMyStartup,
    updateMyStartup,
    deleteMyStartup
};