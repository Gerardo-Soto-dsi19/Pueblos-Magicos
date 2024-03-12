import { Outlet } from 'react-router-dom'
import Cabecera from './Cabecera'
import Footer from './Footer'

function Layout() {
  return (
    <>
      <div className='container max-w-full '>
        <Cabecera />

      </div>
      <div className='md:flex mt-12 justify-center items-center'>
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
