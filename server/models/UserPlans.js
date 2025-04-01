import mongoose from "mongoose";

const userPlansSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userPlanId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
    },
    plans: {
        planid: { type: String },
        name: { type: String },
        description: { type: String },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
        },
        course: { type: String },
        level: { type: String },
        days: { type: String },
    },
},
    { timestamps: true }
);

const UserPlans = mongoose.model("UserPlans", userPlansSchema);
export default UserPlans;