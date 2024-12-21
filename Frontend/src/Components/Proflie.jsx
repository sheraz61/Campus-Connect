import React, { useEffect, useState } from 'react'
import { PencilSquareIcon, CameraIcon } from '@heroicons/react/24/solid';
import CreatePost from './CreatePost';
import ChangePassword from './ChangePassword';
import UpdateDetail from './UpdateDetail';
import ProfileChange from './ProfileChange';
import ChangeCover from './ChangeCover';
import { useNavigate } from 'react-router-dom';
function Profile() {
    const navigate = useNavigate()
    const [userdata, setUserData] = useState({})
    const [stats, setStats] = useState({})
    const [updateTrigger, setUpdateTrigger] = useState(0)
    const [isCreatePost, setIsCreatePost] = useState(false);
    const [isForgetPassword, setIsForgetPassword] = useState(false);
    const [isUpdateDetails, setIsUpdateDetails] = useState(false);
    const [isUpdateProfile, setIsUpdateProfile] = useState(false);
    const [isUpdateCover, setIsUpdateCover] = useState(false);
    useEffect(() => {
        fetch('http://localhost:8000/api/v1/users/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        }).then(response => response.json()).then(data => setUserData(data.data))
        //another fetch request
        fetch('http://localhost:8000/api/v1/dashboard/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
        }).then(res => res.json()).then(data => setStats(data.data))
    }, [updateTrigger])
    return (
        <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 rounded-md'>
            <div className='w-[900px] bg-white rounded-lg shadow-xl overflow-hidden'>
                {/* Cover Image Container */}
                <div className='relative h-[200px] w-full bg-gray-200'>
                    <img
                        src={userdata?.coverImage || ''}
                        alt="Cover"
                        className='w-full h-full object-cover'
                    />
                    <button
                        className='absolute bottom-4 right-4 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700'
                        onClick={() => {
                            setIsCreatePost(false)
                            setIsUpdateDetails(false)
                            setIsForgetPassword(false)
                            setIsUpdateProfile(false)
                            setIsUpdateCover(!isUpdateCover)

                        }}
                    >
                        <CameraIcon className='h-6 w-6' /> {/* Camera Icon */}
                    </button>
                </div>
                {/* Profile Content */}
                <div className='flex flex-col items-center -mt-20 px-6 pb-8'>
                    {/* Profile Image */}
                    <div className='relative border-4 border-white w-[160px] h-[160px] rounded-full overflow-hidden shadow-lg z-10'>
                        <img
                            className='w-full h-full object-cover'
                            src={userdata?.profileImage || ''}
                            alt="Profile"
                        />
                        <button
                            className='z-14 absolute bottom-2 right-4 p-2 bg-orange-700 text-white rounded-full hover:bg-orange-800 flex items-center justify-center'
                            onClick={() => {
                                setIsUpdateProfile(!isUpdateProfile)
                                setIsCreatePost(false)
                                setIsForgetPassword(false)
                                setIsUpdateDetails(false)
                                setIsUpdateCover(false)
                            }}
                        >
                            <PencilSquareIcon className='h-4 w-4 ' /> {/* Pencil Icon */}
                        </button>
                    </div>
                    {/* User Info */}
                    <div className='mt-4 text-center'>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            {userdata?.fullName
                                ? userdata.fullName
                                    .split(' ')
                                    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
                                    .join(' ')
                                : 'User Name'}
                            ({userdata?.userName || 'username'})
                        </h1>
                        <p className='text-gray-500 mt-1'>
                            {userdata?.email || 'email@example.com'}
                        </p>
                    </div>
                    {/* Stats */}
                    <div className='flex gap-8 mt-6'>
                        <div className='text-center'>
                            <p className='font-semibold text-gray-800'>Posts</p>
                            <p className='text-gray-600'>{stats.totalPosts}</p>
                        </div>
                        <div className='text-center'>
                            <p className='font-semibold text-gray-800'>Followers</p>
                            <p className='text-gray-600'>{stats.totalSubscribers}</p>
                        </div>
                        <div className='text-center'>
                            <p className='font-semibold text-gray-800'>Following</p>
                            <p className='text-gray-600'>{stats.totalSubscribedChannels}</p>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex flex-wrap gap-4 mt-6'>
                        <button
                            className='px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800 transition-colors'
                            onClick={() => navigate('/my-posts')}
                        >
                            MY Post
                        </button>
                        <button
                            className='px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800 transition-colors'
                            onClick={() => {
                                setIsCreatePost(!isCreatePost)
                                setIsForgetPassword(false)
                                setIsUpdateDetails(false)
                                setIsUpdateProfile(false)
                                setIsUpdateCover(false)

                            }}
                        >
                            Create Post
                        </button>
                        <button
                            className='px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors'
                            onClick={() => {
                                setIsCreatePost(false)
                                setIsUpdateProfile(false)
                                setIsUpdateCover(false)
                                setIsForgetPassword(!isForgetPassword)
                                setIsUpdateDetails(false)
                            }}
                        >
                            Forget Password
                        </button>
                        <button
                            className='px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors'
                            onClick={() => {
                                setIsCreatePost(false)
                                setIsForgetPassword(false)
                                setIsUpdateProfile(false)
                                setIsUpdateCover(false)
                                setIsUpdateDetails(!isUpdateDetails)
                            }}
                        >
                            Update Details
                        </button>
                    </div>
                    {/* Create Post Section */}
                    <div className='mt-8 w-full'>
                        <div className='bg-gray-100 p-6 rounded-lg shadow-md '>
                            {isCreatePost && <CreatePost setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} />}
                            {isForgetPassword && <ChangePassword setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} />}
                            {isUpdateDetails && <UpdateDetail isUpdateDetails={isUpdateDetails} setIsUpdateDetails={setIsUpdateDetails} setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} />}
                            {isUpdateProfile && <ProfileChange setIsUpdateProfile={setIsUpdateProfile} isUpdateProfile={isUpdateProfile} setUpdateTrigger={setUpdateTrigger} updateTrigger={updateTrigger} />}
                            {isUpdateCover && <ChangeCover isUpdateCover={isUpdateCover} setIsUpdateCover={setIsUpdateCover} updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile // Fixed typo in component name