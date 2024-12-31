// import {createContext ,useContext} from 'react'

// export const LoginContext=createContext({
//     isLoggedIn:false,
//     user:null,
//     setIsLoggedIn:()=>{},
//     setUser:()=>{}
// })

// export const useLogin=()=>{
//     return useContext(LoginContext)
// }

// export const LoginProvider= LoginContext.Provider


// src/Context/Context.jsx
import { createContext, useContext } from 'react';

export const LoginContext = createContext({
    isLoggedIn: false,
    user: null,
    setIsLoggedIn: () => {},
    setUser: () => {}
});

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await fetch('http://localhost:8000/api/v1/users/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access', data.data.accessToken);
            localStorage.setItem('refresh', data.data.refreshToken);
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};

export const useLogin = () => {
    return useContext(LoginContext);
};

export const LoginProvider = LoginContext.Provider;