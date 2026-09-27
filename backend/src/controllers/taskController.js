import Task from "../models/Task.js";
import Startup from "../models/Startup.js";

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            assignedTo,
            dueDate
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const startup = await Startup.findOne({
            founder: req.user.id
        });

        if (!startup) {
            return res.status(404).json({
                message: "Startup not found"
            });
        }

        const task = new Task({
            title,
            description,
            priority,
            assignedTo: assignedTo || req.user.id,
            startup: startup._id,
            dueDate
        });

        await task.save();

        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


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
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

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

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

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