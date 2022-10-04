import React, {memo, useEffect} from 'react';
import useAuthStore from '../../store/authStore';
import useMainStore from '../../store/mainStore';
import { UserType } from '../../types/userTypes';



interface IProps {
    userProfile: UserType;
}

////////////////
// HOME ////////
////////////////

const MainPage:React.FC<IProps> = ({
    userProfile,
}) => {

    const {allUsers} = useAuthStore();

    // MAIN STORE
    const {
        selectedLibrary, 
        enrolledLibraries, 
        fetchEnrolledLibraries,
        loading,
    } = useMainStore(); 

    // FETCH ENROLLED LIBRARIES IF HASN'T YET
    useEffect(() => {
        if(!enrolledLibraries) {
            fetchEnrolledLibraries(userProfile);    
        }
    }, [allUsers, enrolledLibraries, fetchEnrolledLibraries, userProfile]);
    
    ////////////////
    // RENDER //////
    ////////////////
    return (
        <div>
            {
                !selectedLibrary ?
                <div>Please select a library </div>
                :
                <span>Can see all info :D</span>
            }
        </div>
    );
};

export default memo(MainPage);
