import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Formulario from './pages/Formulario'
import RegistroLogin from './pages/RegistroLogin'
import RecuperarContraseña from './pages/RecuperarContraseña'
import GestionSolicitudes from './pages/GestionSolicitudes'
import ResetPassword from './components/ResetPassword'
import GestionRoles from './Gestor Roles/GestionRoles'
import SidebarUser from './Gestor Roles/SidebarUser'


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
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/formulario/registro',
      element: <Formulario />
    },
    {
      path: '/gestor-solicitudes',
      element: <GestionSolicitudes />
    },
    {
      path: '/gestor-roles',
      element: <GestionRoles />
    },
    {
      path:'/editar/informacion-personal',
      element:<SidebarUser/>
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
