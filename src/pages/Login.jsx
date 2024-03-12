import { Outlet, Link } from 'react-router-dom'

const Login = () => {
    return (
        <>
            <div className="bg-white shadow-lg md:w-96 rounded-lg mb-10">
                <div className="flex min-h-full flex-1 flex-col justify-center py-4 lg:px-8 b">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className=' mx-auto'>
                            <img src="../public/logo-ipn-lema-vertical-color.png" />
                        </div>
                        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Acceda a su cuenta
                        </h2>
                    </div>

                    <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="shadow-md rounded-lg py-10 px-5 mb-10 space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Usuario
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Contraseña
                                    </label>
                                    <div className="text-sm">
                                        <Link to="/recuperar/contraseña" className="font-semibold text-zinc-900 hover:text-zinc-700">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-800 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-[#5A1236] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                                >
                                    Ingresar
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/registro/usuario" className="font-semibold leading-6 text-zinc-900 hover:text-zinc-700">
                                Registrate aquí!
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Login
