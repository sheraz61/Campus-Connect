import React, { useEffect, useState } from 'react';
import { 
    PencilSquareIcon, 
    CameraIcon, 
    XMarkIcon,
    DocumentTextIcon,
    BookOpenIcon,
    KeyIcon,
    UserCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';
import ChangePassword from './ChangePassword';
import ProfileChange from './ProfileChange';
import ChangeCover from './ChangeCover';
import { useNavigate } from 'react-router-dom';
import UpdateAccDetail from './UpdateAccDetail';
import CreateUpdate from '../Update/CreateUpdate';
import CreateResource from '../Resource/CreateResource';

function Profile() {
    const navigate = useNavigate();
    const [userdata, setUserData] = useState({});
    const [stats, setStats] = useState({});
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [modal, setModal] = useState({ isOpen: false, type: null });

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/users/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        }).then(response => response.json()).then(data => setUserData(data.data));

        fetch('http://localhost:8000/api/v1/dashboard/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        }).then(res => res.json()).then(data => setStats(data.data));
    }, [updateTrigger]);

    const openModal = (type) => {
        setModal({ isOpen: true, type });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null });
    };

    const renderModalContent = () => {
        switch (modal.type) {
            case 'createPost':
                return <CreateUpdate setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            case 'createResource':
                return <CreateResource setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            case 'changePassword':
                return <ChangePassword setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            case 'updateDetails':
                return <UpdateAccDetail setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            case 'updateProfile':
                return <ProfileChange setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            case 'updateCover':
                return <ChangeCover setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} closeModal={closeModal} />;
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        switch (modal.type) {
            case 'createPost':
                return 'Create New Post';
            case 'createResource':
                return 'Create New Resource';
            case 'changePassword':
                return 'Change Password';
            case 'updateDetails':
                return 'Update Profile Details';
            case 'updateProfile':
                return 'Update Profile Picture';
            case 'updateCover':
                return 'Update Cover Photo';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 px-4 py-6 sm:p-6">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Cover Image Section */}
                <div className="relative h-[150px] sm:h-[200px] w-full bg-gray-200">
                    <img
                        src={userdata?.coverImage || ''}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <button
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-3 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition duration-300 shadow-lg"
                        onClick={() => openModal('updateCover')}
                    >
                        <CameraIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center -mt-12 sm:-mt-16 px-4 sm:px-6 pb-6 sm:pb-8">
                    {/* Profile Image */}
                    <div className="relative border-4 border-white w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full overflow-hidden shadow-lg z-10">
                        <img
                            className="w-full h-full object-cover"
                            src={userdata?.profileImage || ''}
                            alt="Profile"
                        />
                        <button
                            className="absolute bottom-2 right-2 p-1.5 sm:p-2 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition duration-300 shadow-lg"
                            onClick={() => openModal('updateProfile')}
                        >
                            <PencilSquareIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="mt-3 sm:mt-4 text-center px-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {userdata?.fullName
                                ? userdata.fullName
                                    .split(' ')
                                    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
                                    .join(' ')
                                : 'User Name'}
                            <span className="text-gray-600">({userdata?.userName || 'username'})</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">{userdata?.email || 'email@example.com'}</p>
                    </div>

                    {/* Stats Section */}
                    <div className="flex gap-6 sm:gap-8 mt-4 sm:mt-6 text-center">
                        <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-800">Posts</p>
                            <p className="text-sm sm:text-base text-gray-600">{stats.totalPosts}</p>
                        </div>
                        <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-800">Followers</p>
                            <p className="text-sm sm:text-base text-gray-600">{stats.totalSubscribers}</p>
                        </div>
                        <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-800">Following</p>
                            <p className="text-sm sm:text-base text-gray-600">{stats.totalSubscribedChannels}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full px-4 sm:px-6">
                        <button
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            onClick={() => navigate('/my-posts')}
                        >
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>MY Updates</span>
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            onClick={() => openModal('createPost')}
                        >
                            <PencilSquareIcon className="h-4 w-4" />
                            <span>Create Update</span>
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#C84C32] text-white rounded-full hover:bg-[#B33D25] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            onClick={() => openModal('createResource')}
                        >
                            <BookOpenIcon className="h-4 w-4" />
                            <span>Create Resource</span>
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#44546F] text-white rounded-full hover:bg-[#2C3E5D] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            onClick={() => openModal('changePassword')}
                        >
                            <KeyIcon className="h-4 w-4" />
                            <span>Change Password</span>
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#44546F] text-white rounded-full hover:bg-[#2C3E5D] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            onClick={() => openModal('updateDetails')}
                        >
                            <UserCircleIcon className="h-4 w-4" />
                            <span>Update Details</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Popup */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                {getModalTitle()}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </button>
                        </div>
                        
                        {/* Modal Content */}
                        <div className="p-4 sm:p-6">
                            {renderModalContent()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
