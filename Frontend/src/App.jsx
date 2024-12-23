import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Root from './Root'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import Update from './Components/Update'
import {LoginProvider, useLogin} from './Context/Context'
import { useState } from 'react'
import Proflie from './Components/Proflie'
import MyPosts from './Components/MyPosts'
import PostDetails from './Components/PostDetails'
import EditPost from './Components/EditPost'
import Resource from './Components/Resource'
import ResourceDetails from './Components/ResourceDetails'
import EditRes from './Components/EditRes'
import GPA from './Components/GPA'

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
            <Route path='/my-posts' element={<MyPosts />} />
            <Route path='/posts/:id' element={<PostDetails />} />
            <Route path='/papers/:id' element={<ResourceDetails />} />
            <Route path='/edit-post/:id' element={<EditPost />} />
            <Route path='/edit-res/:id' element={<EditRes />} />
           
        </Route>
    )
)
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user,setUser]=useState({})
    return (
        <LoginProvider value={{isLoggedIn,setIsLoggedIn,user,setUser}}>
            <RouterProvider router={router} />
        </LoginProvider>
    
    )
}

export default App