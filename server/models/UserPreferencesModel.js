import mongoose from "mongoose";

const UserPreferences = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    done: {
        type: String,
        enum: ['completed', 'not']
    },
    personalInfo: {
        fullName: { type: String },
        email: { type: String },
        institute: { type: String },
    },
    academic: {
        edulevel: { type: String },
        fieldofstudy: { type: String },
        currentyear: { type: String },
        gpa: { type: Number }
    },
    interestedsubjects: {
        type: [String],
        default: []
    },
    studypreferences: {
        style: { type: String },
        sessionlength: { type: String },
        dailyhours: { type: String },
    },
},
    { timestamps: true }
);

const UserPreference = mongoose.model("UserPreferences", UserPreferences);
export default UserPreference;