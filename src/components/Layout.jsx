import { Outlet, useLocation } from 'react-router-dom'
import Cabecera from './Cabecera'
import Footer from './Footer'

function Layout() {
  const location = useLocation();

  const shouldHideHeaderFooter = location.pathname === '/gestor-solicitudes' || location.pathname ==='/gestor-roles';
  return (
    <>
      {!shouldHideHeaderFooter && (
        <div className="container max-w-full">
          <Cabecera />
        </div>
      )}
      <Outlet />
      {!shouldHideHeaderFooter && (
        <div>
          <Footer />
        </div>
      )}
    </>
  )
}

export default Layout
