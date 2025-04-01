import Plan from "../models/userPlan.js";
import UserPlans from "../models/UserPlans.js";
import UserPreference from "../models/UserPreferencesModel.js";

export const addUserPreferences = async (req, res) => {
    try {
        const {
            userId,
            done,
            personalInfo,
            academic,
            interestedsubjects,
            studypreferences
        } = req.body;

        // Check if preferences already exist for this user
        const existingPreferences = await UserPreference.findOne({ userId });

        if (existingPreferences) {
            return res.json({
                message: "User preferences already exist..",
                success: false,
                redirect: true,
                error: false
            });
        }

        if (existingPreferences?.done === "completed") {
            return res.json({
                message: "User preferences already completed.",
                success: false,
                redirect: true,
                error: false
            });
        }

        // Create new user preferences
        const newUserPreference = new UserPreference({
            userId,
            done,
            personalInfo: {
                fullName: personalInfo.fullName,
                email: personalInfo.email,
                institute: personalInfo.institute
            },
            academic: {
                edulevel: academic.edulevel,
                fieldofstudy: academic.fieldofstudy,
                currentyear: academic.currentyear,
                gpa: academic.gpa
            },
            interestedsubjects: interestedsubjects || [],
            studypreferences: {
                style: studypreferences.style,
                sessionlength: studypreferences.sessionlength,
                dailyhours: studypreferences.dailyhours
            }
        });

        await newUserPreference.save();
        return res.json({
            message: "User preferences saved successfully.",
            success: true,
            redirect: true,
            error: false
        });

    } catch (error) {
        console.error("Error adding user preferences:", error);
        return res.json({ msg: "Error adding user preferences." });
    }
};

export const getUserPreferencesDetails = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await UserPreference.findOne({ userId: userid });

        if (user) {
            return res.json({
                message: "Data fetched successfully.",
                data: user,
                success: true,
                error: false
            });
        } else {
            return res.json({
                message: "User with given ID not found.",
                success: false,
                error: true
            });
        }
    } catch (err) { // Was using 'error' in catch but 'err' in console.error
        console.error(err);
        return res.status(500).json({
            message: "Error fetching data.",
            success: false,
            error: true
        });
    }
};

export const addUserStudyPlan = async (req, res) => {
    try {
        const {
            userId,
            name,
            planDetails,
        } = req.body;

        // Create new user preferences
        const newUserPlan = new Plan({
            userId,
            name,
            planDetails: planDetails
        });

        await newUserPlan.save();
        return res.json({
            message: "User Plan saved successfully.",
            id: newUserPlan?._id,
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error adding user plan:", error);
        return res.json({
            message: "Error adding user plan.",
            success: false,
            error: true
        });
    }
};

export const addUserPlans = async (req, res) => {
    try {
        const {
            userId,
            userPlanId,
            name,
            plans,
        } = req.body;

        // Create new user preferences
        const newPlan = new UserPlans({
            userId,
            userPlanId,
            name,
            plans: plans
        });

        await newPlan.save();
        return res.json({
            message: "Plan saved successfully.",
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error adding plan:", error);
        return res.json({
            message: "Error adding plan.",
            success: false,
            error: true
        });
    }
};

export const getUserPlans = async (req, res) => {
    try {
        const { userid } = req.body;
        const userPlans = await UserPlans.find({ userId: userid });

        if (!userPlans || userPlans.length === 0) {
            return res.json({
                msg: "User with given email not found.",
                success: false,
                error: true
            });
        }

        return res.json({
            message: "Data fetched successfully.",
            data: userPlans,
            success: true,
            error: false
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching data.",
            success: false,
            error: true
        });
    }
};

export const getPlanDetails = async (req, res) => {
    try {
        const { userid, planId } = req.body;
        if (!userid || !planId) {
            return res.status(400).json({
                message: "User ID and Plan ID are required",
                success: false,
                error: true
            });
        }

        const plan = await Plan.findOne({ userId: userid, _id: planId });
        if (!plan) {
            return res.status(404).json({
                message: "Plan not found",
                success: false,
                error: true
            });
        }

        return res.json({
            message: "Data fetched successfully",
            data: plan,
            success: true,
            error: false
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error fetching data",
            success: false,
            error: true
        });
    }
};
