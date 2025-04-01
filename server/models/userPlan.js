import mongoose from "mongoose";

const userPlanSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: 'Study Plan'
    },
    planDetails: {
        type: Array,
        required: true
    }
},
    { timestamps: true }
);

const Plan = mongoose.model("Plan", userPlanSchema);
export default Plan;