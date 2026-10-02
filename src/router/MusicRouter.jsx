import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Mainlayout from '../layout/Mainlayout'
import Home from '../screen/Home'
import Login from '../screen/Login';
import Register from '../screen/Register';

const MusicRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Mainlayout />,
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "login",
                    element: <Login />
                },
                {
                    path: "register",
                    element: <Register />
                }
            ],
        },])
    return <RouterProvider router={router} />
}

export default MusicRouter;