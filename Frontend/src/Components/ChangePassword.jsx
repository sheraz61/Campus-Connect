import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function ChangePassword() {
    const navigate = useNavigate()
    const [forgetPassword, setForgetPassword] = useState({
        oldPassword: '',
        newPassword: '',
    })
    const onChngeForget = (e) => {
        const { name, value } = e.target;
        setForgetPassword((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleForgetSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/v1/users/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
            body: JSON.stringify({
                oldPassword: forgetPassword.oldPassword,
                newPassword: forgetPassword.newPassword
            })
        })
        if (!response.ok) {
            alert('Password not changed')
        }
        if (response.ok) {
            alert('Password changed successfully')
            setForgetPassword({
                oldPassword: '',
                newPassword: '',
            })

            navigate('/login')
        }

    };
    return (
        <form onSubmit={handleForgetSubmit} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between w-full'>
                <label htmlFor="oldPassword" className="text-left w-32">
                    Old Password
                </label>
                <input
                    type="password"
                    name="oldPassword"
                    placeholder='Enter Old Password'
                    onChange={onChngeForget}
                    value={forgetPassword.oldPassword}
                    autoComplete='current-password'
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <div className='flex items-center justify-between w-full'>
                <label htmlFor="newPassword" className="text-left w-32">
                    New Password
                </label>
                <input
                    type="password"
                    name="newPassword"
                    placeholder='Enter New Password'
                    onChange={onChngeForget}
                    value={forgetPassword.newPassword}
                    autoComplete='new-password'
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <button
                type='Submit'
                className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
            >
                Change Password
            </button>
        </form>
    )
}

export default ChangePassword