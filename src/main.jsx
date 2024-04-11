import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContext, AuthProvider } from './components/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Formulario from './pages/Formulario'
import RegistroLogin from './pages/RegistroLogin'
import RecuperarContraseña from './pages/RecuperarContraseña'
import GestorSolicitudes from './pages/GestorSolicitudes'
import GestionSolicitudes from './pages/GestionSolicitudes'



const router = createBrowserRouter([{
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: '/registro/usuario',
        element: <RegistroLogin />
      },
      {
        path: '/recuperar/contraseña',
        element: <RecuperarContraseña />
      },
      {
        path: '/formulario/registro',
        element: <Formulario />
      },
      {
        path: '/gestion-solicitudes',
        element: <GestorSolicitudes />
      },
      {
        path: '/gestor-solicitudes',
        element: <GestionSolicitudes />
      }
    ]
  },

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
