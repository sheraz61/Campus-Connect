import {createContext ,useContext} from 'react'

export const LoginContext=createContext({
    isLoggedIn:false,
    user:null,
    setIsLoggedIn:()=>{},
    setUser:()=>{}
})

export const useLogin=()=>{
    return useContext(LoginContext)
}

export const LoginProvider= LoginContext.Provider