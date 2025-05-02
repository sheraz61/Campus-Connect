import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root from './Root'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Update from './Components/Update/Update'
import {LoginProvider, refreshToken} from './Context/Context'
import { useState ,useEffect} from 'react'
import Proflie from './Components/Profile/Proflie'
import Resource from './Components/Resource/Resource'
import ResourceDetails from './Components/Resource/ResourceDetails'
import GPA from './Components/GPA'
import EditUpdate from './Components/Update/EditUpdate'
import EditResource from './Components/Resource/EditResource'
import UpdateDetails from './Components/Update/UpdateDetails'
import MyUpdates from './Components/Update/MyUpdates'
import AdminDashboard from './Components/AdminDashboard'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Root />}>
            <Route path='' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/update' element={<Update />} />
            <Route path='/gpa' element={<GPA />} />
            <Route path='/resource' element={<Resource />} />
            <Route path='/profile' element={<Proflie />} />
            <Route path='/my-posts' element={<MyUpdates />} />
            <Route path='/posts/:id' element={<UpdateDetails />} />
            <Route path='/papers/:id' element={<ResourceDetails />} />
            <Route path='/edit-post/:id' element={<EditUpdate />} />
            <Route path='/edit-res/:id' element={<EditResource />} />
           <Route path='admin' element={<AdminDashboard/>} />
        </Route>
    )
)
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user,setUser]=useState({})
    //handle refresh to update session
    useEffect(() => {
        const checkAuth = async () => {
            const tokenData = await refreshToken();
            if (tokenData) {
                setIsLoggedIn(true);
                setUser({
                    id: tokenData.data.user._id,
                    userName: tokenData.data.user.userName,
                    email: tokenData.data.user.email,
                });
              
                
            } else {
                setIsLoggedIn(false);
                setUser({});
            }
        };

        checkAuth();
    }, []);
    return (
        <>
            <Toaster position="top-right" />
            <LoginProvider value={{isLoggedIn,setIsLoggedIn,user,setUser}}>
                <RouterProvider router={router} />
            </LoginProvider>
        </>
    )
}

export default App