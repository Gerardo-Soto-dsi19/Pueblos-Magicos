import React from 'react'
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react'
import { Link } from "react-router-dom"
function Header() {

    return (
        <>
            <header className='bg-white border rounded-md px-4  py-2.5'>
                <div className='flex justify-between mt-1'>
                    <label>Administrador de sistema</label>
                    <div className='flex items-center cursor-pointer'>
                        <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiDotsVertical /></span>}>
                            <Dropdown.Item>
                                <Link to={'/editar/informacion-personal'}>
                                    <FaUserCircle className="inline-block mr-2" />
                                    <span>Editar perfil</span>
                                </Link>
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
