import { Outlet } from 'react-router-dom'
import Cabecera from './Cabecera'
import Footer from './Footer'

function Layout() {
  return (
    <>
      <div className='container max-w-full '>
        <Cabecera />
      </div>
      
        <Outlet />
      
      <div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
