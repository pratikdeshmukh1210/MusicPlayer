import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Mainlayout from '../layout/Mainlayout'
import Home from '../screen/Home'

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
            ],
        },])
    return <RouterProvider router={router} />
}

export default MusicRouter;