import React, { useRef } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function ProfileChange({ setIsUpdateProfile, setUpdateTrigger, updateTrigger, isUpdateProfile }) {
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        profileImage: null,
    })
    const profileImgRef = useRef(null);

    const onChangeProfile = (e) => {
        const { name, files } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: files[0]
        }));
    }
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        // Create FormData object dynamically
        const data = new FormData();
        data.append("profileImage", profile.profileImage);
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/profile-image', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: data, // FormData automatically handles file upload
            });
            console.log(response);

            if (!response.ok) {
                alert('Profile Image Not Update')
            }
            if (response.ok) {
                navigate('/profile')
                setUpdateTrigger(updateTrigger + 1)
                setIsUpdateProfile(!isUpdateProfile)
                if (profileImgRef.current) profileImgRef.current.value = '';
                alert('profile change successfully!');
                setProfile({
                    profileImage: null,
                })
            }
        } catch (error) {
            console.error('Failed to update profile:', error.message);
        }
    }
    return (
        <form onSubmit={handleProfileSubmit}>
            <div className="flex items-center  justify-between w-full">
                <label htmlFor="profileImage" className="text-left w-32">
                    Profile Image
                </label>
                <input
                    type="file"
                    name="profileImage"
                    onChange={onChangeProfile}
                    ref={profileImgRef}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <button
                type='Submit'
                className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
            >
                Update Profile
            </button>
        </form>
    )
}

export default ProfileChange