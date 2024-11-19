"use client";
import Link from "next/link";
import Image from "next/image";


type Props = {
    error: string;
}

export default  function FetchInformationError({error}: Props) {
    return (
        <div
            className="min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200 flex items-center justify-center">
            <main className="container mx-auto pt-16">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto flex">
                    {/* Sección de la imagen de error */}
                    <div className="flex items-center justify-center">
                        <Image
                            src="/detective-book.png" // reemplaza con el URL de una ilustración adecuada
                            alt="Error Illustration"
                            className="w-80 h-80 object-cover"
                        />
                    </div>

                    {/* Sección del mensaje de error y botones de acción */}
                    <div className="w-2/3 p-8">
                        <h1 className="text-2xl font-bold text-blue-800">Oops, something went wrong!</h1>
                        <p className="text-lg text-gray-700 mt-4">
                            We couldn’t retrieve your information. This might be due to a temporary issue.
                        </p>
                        <p className="text-red-500 mt-2">{error}</p>

                        {/* Botones de acción */}
                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-blue-600"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-gray-400"
                            >
                                Go Home
                            </Link>
                            <Link
                                href="/auth/sign-in"
                                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 hover:bg-green-800"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    )
}