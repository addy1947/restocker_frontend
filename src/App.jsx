import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Landing_Page from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import Stock from './pages/Stock'
import InStock from './pages/InStock'




const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing_Page />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      )
    },
    {
      path:'/product/:productId',
      element:(
        <ProtectedRoute>
          <Stock/>
        </ProtectedRoute>
      )
    },
    {
      path:'/instock',
      element:(
        <ProtectedRoute>
          <InStock/>
        </ProtectedRoute>
      )
    },
  ])


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App