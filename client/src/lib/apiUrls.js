export const backendDomin = "https://studysync-uiks.onrender.com"

const SummaryApi = {
    addUserPreferences: {
        url: `${backendDomin}/api/userpreference/adduserpreferences`,
        method: "POST"
    },
    getUserPreferencesDetails: {
        url: `${backendDomin}/api/userpreference/getuserpreferencedetails`,
        method: "POST"
    },

    addUserStudyPlan: {
        url: `${backendDomin}/api/userplan/adduserplan`,
        method: "POST"
    },
    getPlanDetails: {
        url: `${backendDomin}/api/userplan/getdetails`,
        method: "POST"
    },

    addUserPlans: {
        url: `${backendDomin}/api/userplans/addplan`,
        method: "POST"
    },
    getUserPlans: {
        url: `${backendDomin}/api/userplans/getplans`,
        method: "POST"
    },

}


export default SummaryApi