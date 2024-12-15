import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,createRoutesFromElements , Route , RouterProvider} from 'react-router-dom'
import Root from './Root'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Root/>}>
      <Route path='' element={<Home/>}/>
<Route path='/login' element={<Login/>} />
<Route path='/register' element={<Register/>} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
