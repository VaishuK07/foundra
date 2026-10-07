import mongoose from "mongoose";
import Task from "../models/Task.js";
import Startup from "../models/Startup.js";
import User from "../models/User.js";

const allowedStatuses = [
    "Pending",
    "In Progress",
    "Completed"
];

const allowedPriorities = [
    "Low",
    "Medium",
    "High"
];


// ===============================
// CREATE TASK
// ===============================

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            assignedTo,
            dueDate
        } = req.body;

        // Validate title
        if (!title?.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // Find user's startup
        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        // Default assignee = current user
        const assigneeId = assignedTo || req.user.id;

        // Validate assignedTo ObjectId
        if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
            return res.status(400).json({
                message: "Invalid assigned user ID"
            });
        }

        // Check assigned user exists
        const assignedUser = await User.findById(assigneeId);

        if (!assignedUser) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        // Check user belongs to startup team
        const isTeamMember = startup.teamMembers.some(
            memberId => memberId.toString() === assigneeId.toString()
        );

        if (!isTeamMember) {
            return res.status(403).json({
                message: "Task can only be assigned to a startup team member"
            });
        }

        // Validate priority
        if (
            priority !== undefined &&
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                message: "Invalid task priority"
            });
        }

        // Validate due date
        if (
            dueDate !== undefined &&
            dueDate !== null &&
            Number.isNaN(Date.parse(dueDate))
        ) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        const task = new Task({
            title: title.trim(),
            description,
            priority,
            assignedTo: assigneeId,
            startup: startup._id,
            dueDate
        });

        await task.save();

        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        console.error("Create task error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// GET MY TASKS
// ===============================

const getMyTasks = async (req, res) => {
    try {
        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        const tasks = await Task.find({
            startup: startup._id
        })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            tasks
        });

    } catch (error) {
        console.error("Get tasks error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// UPDATE TASK
// ===============================

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Check startup ownership
        const startup = await Startup.findOne({
            _id: task.startup,
            founder: req.user.id
        });

        if (!startup) {
            return res.status(403).json({
                message: "You are not allowed to update this task"
            });
        }

        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            dueDate
        } = req.body;

        // Validate title
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Task title cannot be empty"
                });
            }

            task.title = title.trim();
        }

        // Update description
        if (description !== undefined) {
            task.description = description;
        }

        // Validate status
        if (status !== undefined) {
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid task status"
                });
            }

            task.status = status;
        }

        // Validate priority
        if (priority !== undefined) {
            if (!allowedPriorities.includes(priority)) {
                return res.status(400).json({
                    message: "Invalid task priority"
                });
            }

            task.priority = priority;
        }

        // Validate assigned user
        if (assignedTo !== undefined) {

            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                return res.status(400).json({
                    message: "Invalid assigned user ID"
                });
            }

            const assignedUser = await User.findById(assignedTo);

            if (!assignedUser) {
                return res.status(404).json({
                    message: "Assigned user not found"
                });
            }

            const isTeamMember = startup.teamMembers.some(
                memberId =>
                    memberId.toString() === assignedTo.toString()
            );

            if (!isTeamMember) {
                return res.status(403).json({
                    message: "Task can only be assigned to a startup team member"
                });
            }

            task.assignedTo = assignedTo;
        }

        // Validate due date
        if (dueDate !== undefined) {

            if (
                dueDate !== null &&
                Number.isNaN(Date.parse(dueDate))
            ) {
                return res.status(400).json({
                    message: "Invalid due date"
                });
            }

            task.dueDate = dueDate;
        }

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.error("Update task error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// DELETE TASK
// ===============================

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Check startup ownership
        const startup = await Startup.findOne({
            _id: task.startup,
            founder: req.user.id
        });

        if (!startup) {
            return res.status(403).json({
                message: "You are not allowed to delete this task"
            });
        }

        await Task.findByIdAndDelete(taskId);

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete task error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


export default {
    createTask,
    getMyTasks,
    updateTask,
    deleteTask
};