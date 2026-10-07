import Startup from "../models/Startup.js";

const allowedStages = [
    "Idea",
    "Research",
    "Prototype",
    "MVP",
    "Launch"
];

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

        // Required fields validation
        if (
            !name?.trim() ||
            !description?.trim() ||
            !domain?.trim()
        ) {
            return res.status(400).json({
                message: "Name, description and domain are required"
            });
        }

        // Stage validation
        if (stage !== undefined && !allowedStages.includes(stage)) {
            return res.status(400).json({
                message: "Invalid startup stage"
            });
        }

        // Skills validation
        if (
            skillsNeeded !== undefined &&
            !Array.isArray(skillsNeeded)
        ) {
            return res.status(400).json({
                message: "skillsNeeded must be an array"
            });
        }

        const startup = new Startup({
            name: name.trim(),
            description: description.trim(),
            domain: domain.trim(),
            stage,
            location: location?.trim(),
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

        // Validate name
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Startup name cannot be empty"
                });
            }

            startup.name = name.trim();
        }

        // Validate description
        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    message: "Description cannot be empty"
                });
            }

            startup.description = description.trim();
        }

        // Validate domain
        if (domain !== undefined) {
            if (!domain.trim()) {
                return res.status(400).json({
                    message: "Domain cannot be empty"
                });
            }

            startup.domain = domain.trim();
        }

        // Validate stage
        if (stage !== undefined) {
            if (!allowedStages.includes(stage)) {
                return res.status(400).json({
                    message: "Invalid startup stage"
                });
            }

            startup.stage = stage;
        }

        // Update location
        if (location !== undefined) {
            startup.location = location.trim();
        }

        // Validate skills
        if (skillsNeeded !== undefined) {
            if (!Array.isArray(skillsNeeded)) {
                return res.status(400).json({
                    message: "skillsNeeded must be an array"
                });
            }

            startup.skillsNeeded = skillsNeeded;
        }

        // Validate progress
        if (progress !== undefined) {
            if (
                typeof progress !== "number" ||
                progress < 0 ||
                progress > 100
            ) {
                return res.status(400).json({
                    message: "Progress must be a number between 0 and 100"
                });
            }

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