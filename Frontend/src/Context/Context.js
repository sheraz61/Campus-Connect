import {createContext ,useContext} from 'react'

export const LoginContext=createContext({
    isLoggedIn:false,
    setIsLoggedIn:()=>{}
})

export const useLogin=()=>{
    return useContext(LoginContext)
}

export const LoginProvider= LoginContext.Provider