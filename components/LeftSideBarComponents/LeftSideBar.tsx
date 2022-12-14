import {memo} from 'react';
import useAuthStore from '../../store/authStore';
import Button from '../Common/Button';
import LeftSideBarMenu from './LeftSideBarMenu';
import Link from 'next/link';
import useMainStore from '../../store/mainStore';


// PROPS INTERFACE
interface IProps {
    // userProfile: IUser | null;
}

////////////////////
// LEFT SIDE BAR ///
////////////////////

const LeftSideBar:React.FC<IProps> = () => {

    /////////////////
    // ZUSTAND //////
    /////////////////

    const {logout, userProfile} = useAuthStore();

    const {selectedLibrary, resetMainStoreState} = useMainStore();

    /////////////////
    // RENDER ///////
    /////////////////
    
    return (
        <div className='w-[250px] min-h-[600px] h-full leftSideBarBg flex flex-col items-center justify-between py-10 gap-10'
            style={{
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
            }}
        >

            {/* APP TITLE */}
            <Link href="/">
                <span className='text-white text-[40px] font-bold transition cursor-pointer hover:scale-[1.1]'>
                    Booklet
                </span>
            </Link>
            

            {/* SHOW MENU IF LOGGED IN */}
            {
                userProfile && selectedLibrary ?
                <LeftSideBarMenu 
                    selectedLibrary={selectedLibrary}
                    loggedUserId={userProfile.id}
                />
                :
                // <div className='text-white'>{!userProfile ? "Not Logged :/" : "Select a library!"}</div>
                null
            }

            {/* SETTINGS */}

            {/* LOGOUT BTN */}
            {
                userProfile &&
                <div className='flex flex-col items-center justify-start w-full'>

                    {
                        userProfile.username &&
                        (
                        <span
                            className='text-white text-2xl mb-4'
                        >
                            Hi, <span className='font-bold'>{userProfile.username}</span>
                        </span>
                        )
                    }
                    

                    <Button 
                        onClick={() => {
                            // LOGOUT AUTH STORE
                            logout();
                            // CLEAN MAIN STORE
                            resetMainStoreState();
                        }}
                        txt="Logout"
                        icon="logout"
                        width="80%"
                        borderRadius='8px'
                        txtCss='font-semibold ml-3'
                    />
                </div>
            }
        </div>  
    );
};

export default memo(LeftSideBar);


