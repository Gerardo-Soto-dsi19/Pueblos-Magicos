import { resetPasswordService } from '../api/api'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import { Spinner } from 'flowbite-react';
function ResetPassword() {
    const [searchParams] = useSearchParams();
    const user = searchParams.get('user');
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        console.log('usuario de URL: ', user);
        console.log('token de URL: ', token);
        setIsLoading(true)
        try {
            const dataForm = {
                data: {
                    "token": token,
                    "user_name": user,
                    "password": newPassword,
                    "password_confirmation": newPasswordConfirm
                }
            }
            const response = await resetPasswordService(dataForm)        
            Swal.fire({
                icon:'success',                
                title: 'Éxito!',
                text: response.data.status,
                confirmButtonColor: '#6c1d45', 
                confirmButtonText: 'Aceptar'
            })
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',                
                title: 'Error',
                text: error.response.data.data.user_name.join('\n'),
                confirmButtonColor: '#6c1d45', 
                confirmButtonText: 'Aceptar'
              });
            
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <div className='md:flex justify-center items-center mt-10 sm: px-10'>
                <div className='bg-white shadow-lg md:w-96 rounded-lg mb-10'>
                    <div className='flex min-h-full flex-1 flex-col justify-center'>
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className=' mx-auto'>
                                <img src="../public/logo-ipn-lema-vertical-color.png" />
                            </div>
                            <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Recuperar contraseña
                            </h2>
                        </div>
                        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                            <form className="rounded-lg py-10 px-5 mb-10 space-y-6" onSubmit={handleResetPassword}>
                                <div>
                                    <label htmlFor="new_Password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Constraseña nueva
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="new_Password"
                                            name="new_Password"
                                            type="password"
                                            autoComplete="new_Password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="new_Password_Confirm" className="block text-sm font-medium leading-6 text-gray-900">
                                        Confirmar constraseña
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="new_Password_Confirm"
                                            name="new_Password_Confirm"
                                            type="password"
                                            autoComplete="new_Password_Confirm"
                                            required
                                            value={newPasswordConfirm}
                                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                </div>
                                <div className='mt-6'>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-[#6c1d45] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#8C3A68]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Spinner className='spinner-custom' aria-label="Spinner de carga" />
                                        ) : (
                                            'Actualizar contraseña'
                                        )}

                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
