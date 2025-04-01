import express from "express";
import { addUserPlans, addUserPreferences, addUserStudyPlan, getPlanDetails, getUserPlans, getUserPreferencesDetails } from "../controllers/Controller.js";

const router = express.Router();

router.post("/userpreference/adduserpreferences", addUserPreferences);
router.post("/userpreference/getuserpreferencedetails", getUserPreferencesDetails);

router.post("/userplan/adduserplan", addUserStudyPlan);
router.post("/userplan/getdetails", getPlanDetails);

router.post("/userplans/addplan", addUserPlans);
router.post("/userplans/getplans", getUserPlans);

export default router;
