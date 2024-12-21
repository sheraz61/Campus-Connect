import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function UpdateDetail({ setIsUpdateDetails, isUpdateDetails, updateTrigger, setUpdateTrigger }) {
    const navigate = useNavigate()
    const [accountDetails, setAccountDetails] = useState({
        fullName: '',
        email: '',
    })
    const onChangeDetails = (e) => {
        const { name, value } = e.target;
        setAccountDetails((prev) => {
            return { ...prev, [name]: value }
        })
    }
    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/v1/users/update-details', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
            },
            body: JSON.stringify({
                fullName: accountDetails.fullName,
                email: accountDetails.email,
            })
        })
        if (!response.ok) {
            alert('Details not updated')
        }
        if (response.ok) {
            alert('Details updated successfully')
            setAccountDetails({
                fullName: '',
                email: '',
            })
            setUpdateTrigger(updateTrigger + 1)
            navigate('/profile')
            setIsUpdateDetails(!isUpdateDetails)
        }
    }
    return (
        <form onSubmit={handleSubmitDetails} className='flex flex-col gap-4'>
            <div className='flex items-center justify-between w-full'>
                <label htmlFor="fullName" className="text-left w-32">
                    Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    placeholder='Enter Full Name'
                    onChange={onChangeDetails}
                    value={accountDetails.fullName}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <div className='flex items-center justify-between w-full'>
                <label htmlFor="email" className="text-left w-32">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder='Enter Email...'
                    onChange={onChangeDetails}
                    value={accountDetails.email}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <button
                type='Submit'
                className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
            >
                Update Details
            </button>
        </form>
    )
}

export default UpdateDetail