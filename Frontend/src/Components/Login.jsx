import React, { useState } from 'react'
import Button from './Button'
import { useLogin } from '../Context/Context'
import { useNavigate } from 'react-router-dom';
function Login() {
    const { setIsLoggedIn, setUser } = useLogin();
    const navigate = useNavigate();
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


        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to login')
        }
        if (response.ok) {
            localStorage.setItem('access', data.data.accessToken)
            localStorage.setItem('refresh', data.data.refreshToken)
            setIsLoggedIn(true);
            setUser({
                id: data.data.user._id,
                userName: data.data.user.userName,
                email: data.data.user.email,
            })
            navigate('/update')
            setUserLogin({
                userName: '',
                email: '',
                password: '',
            })
            alert(data.message);
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
                                autoComplete='userName'
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
                                autoComplete='current-password'
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