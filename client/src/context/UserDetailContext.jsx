import { createContext, useEffect, useState } from "react";
// import { useUser } from '@clerk/clerk-react'


export const UserDetailContext = createContext();

// export const UserDetailProvider = ({ children }) => {
//     // const { user } = useUser();
//     // const [userDetails, setUserDetails] = useState(user);

//     // useEffect(() => {
//     //     setUserDetails(user);
//     // }, [userDetails, user]);

//     return (
//         <UserDetailContext.Provider>
//             {children}
//         </UserDetailContext.Provider>
//     );
// };