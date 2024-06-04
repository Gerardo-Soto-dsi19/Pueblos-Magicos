import React, { useState, useEffect } from 'react';
import { Badge, Dropdown } from 'flowbite-react'
import { HiDotsVertical } from "react-icons/hi";
import { Modal } from 'flowbite-react'
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

import '../../index.css'

function CardSolicitud({ dataUsers }) {
    const [toggled, setToggled] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dataInfoUser, setDataInfoUser] = useState([]);

    useEffect(() => {
        if (dataUsers && dataUsers.data && dataUsers.data.data && dataUsers.data.data.usuarios) {
            setDataInfoUser(dataUsers.data.data.usuarios.data);
        }
        console.log(dataInfoUser);
    }, [dataUsers]);

    const handleToggle = () => {

        setToggled(!toggled);
    };
    return (
        <>
            {dataInfoUser.map((user) => (
                <div key={user.id} className='m-3 bg-white shadow-md px-5 py-4 rounded-xl flex justify-between'>
                    <div className='w-2/3'>
                        <p className='font-bold mb-3 text-gray-700  uppercase'>
                            Usuario: {''}
                            <span className='font-normal normal-case'>{user.user_name}</span>
                        </p>
                        <p className='font-bold mb-3 text-gray-700  uppercase'>
                            Tipo rol: {''}
                            <span className='font-normal normal-case'>{user.tipo.tipo_usuario}</span>
                        </p>
                        <div className="flex">
                            <p className='flex gap-3 font-bold text-gray-700  uppercase'>
                                Estado: {''}
                                <Badge color={'success'} className='h-auto'>
                                    Aceptado
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className="flex flex-col items-center">
                            <p className='font-bold text-gray-700  uppercase'>Dar de baja</p>
                            <button
                                onClick={handleToggle}
                                className={`toggle-button ${toggled ? 'toggled' : ''}`}
                            >
                                <div className="thumb"></div>
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center cursor-pointer'>
                        <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiDotsVertical /></span>}>
                            <Dropdown.Item onClick={() => setOpenModal(true)}>Editar</Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            ))}
            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Editar rol</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                            companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                            to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                            soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button><HiCheckCircle /></button>
                    <button>
                        <HiXCircle />
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default CardSolicitud
