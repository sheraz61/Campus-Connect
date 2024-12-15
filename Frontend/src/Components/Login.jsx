import React, { useState } from 'react'
import Button from './Button'

function Login() {

    const [userLogin, setUserLogin] = useState({
        userName: '',
        email: '',
        password: '',
    })
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUserLogin((prev) => (
            {
                ...prev,
                [name]: value,
            }
        ))
        console.log(userLogin);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userLogin),
        })

        if (!response.ok) {
            throw new Error('Failed to login')
        }
        if (response.ok) {
            setUserLogin({
                userName: '',
                email: '',
                password: '',
            })
            console.log('login successfully');

        }
    }
    return (
        <>
            <div className='w-screen h-screen  flex items-center justify-center '>
                <div className='max-w-[550px] border-2 border-black rounded-xl flex flex-col items-center justify-center p-5 gap-5'>
                    <h1>Login</h1>
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
                                onChange={onInputChange}
                                value={userLogin.userName}
                                placeholder='Enter user name'
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
                                onChange={onInputChange}
                                value={userLogin.email}
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
                                required
                                onChange={onInputChange}
                                value={userLogin.password}
                                className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                            />
                        </div>
                        <Button text='Login' />


                    </form>
                </div>
            </div>
        </>
    )
}

export default Login