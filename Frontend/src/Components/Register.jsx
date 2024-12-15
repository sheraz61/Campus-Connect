import React, { useState, useRef } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        password: '',
        profileImage: null,
        coverImage: null,
    });

    // Refs for file inputs
    const profileImageRef = useRef(null);
    const coverImageRef = useRef(null);

    const onInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object dynamically
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/register', {
                method: 'POST',
                body: data, // FormData automatically handles file upload
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.ok) {
                navigate('/login')
            }
            // Clear form after successful submission
            setFormData({
                userName: '',
                fullName: '',
                email: '',
                password: '',
                profileImage: null,
                coverImage: null,
            });

            // Clear file inputs
            if (profileImageRef.current) profileImageRef.current.value = '';
            if (coverImageRef.current) coverImageRef.current.value = '';

            console.log('User registered successfully!');
        } catch (error) {
            console.error('Failed to register user:', error.message);
        }
    };

    return (
        <div className="w-screen h-screen  flex items-center justify-center">
            <div className="max-w-[550px] border-2 border-black rounded-xl flex flex-col items-center justify-center p-5 gap-5">
                <h1 className="text-3xl">Register</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex items-start justify-center flex-col gap-5 w-full"
                >
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="userName" className="text-left w-32">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={onInputChange}
                            placeholder='Enter user name'
                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="fullName" className="text-left w-32">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder='Enter full name'
                            value={formData.fullName}
                            onChange={onInputChange}
                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="email" className="text-left w-32">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter email address'
                            value={formData.email}
                            onChange={onInputChange}
                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="password" className="text-left w-32">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Enter password'
                            value={formData.password}
                            onChange={onInputChange}
                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="profileImage" className="text-left w-32">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            name="profileImage"
                            ref={profileImageRef}
                            onChange={onInputChange}

                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <label htmlFor="coverImage" className="text-left w-32">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            name="coverImage"
                            ref={coverImageRef}
                            onChange={onInputChange}
                            required
                            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                        />
                    </div>

                    <Button text="Register" />
                </form>
            </div>
        </div>
    );
}

export default Register;
