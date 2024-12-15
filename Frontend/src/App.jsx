import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root from './Root'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Update from './Components/Update'
import {LoginProvider, useLogin} from './Context/Context'
import { useState } from 'react'
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Root />}>
            <Route path='' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/update' element={<Update />} />
        </Route>
    )
)
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <LoginProvider value={{isLoggedIn,setIsLoggedIn}}>
            <RouterProvider router={router} />
        </LoginProvider>
    
    )
}

export default App