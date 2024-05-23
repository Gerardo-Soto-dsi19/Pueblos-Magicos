
function ResetPassword() {
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
                            <form className="rounded-lg py-10 px-5 mb-10 space-y-6" action="#" method="POST">
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
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                </div>
                                <div className='mt-6'>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-[#6c1d45] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                                    >
                                        Actualizar contraseña
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
