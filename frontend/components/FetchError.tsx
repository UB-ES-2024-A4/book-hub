import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";

type Props = {
    errorDetail: string;
}

export default function FetchError({errorDetail}: Props) {
    return (
        // Tarjeta de "Error de Conexión"
        <Card className="bg-white/80 backdrop-blur-sm mx-5">
            <CardContent>
                <div className="grid md:grid-cols-[200px_1fr] gap-4 pt-5">
                    <Image
                        alt="Error placeholder image"
                        className="rounded-lg object-cover"
                        width={150}
                        height={190}
                        src="/noposts.png" // Imagen representativa para errores de conexión
                    />
                    <div className="space-y-4 pt-2">
                        <div>
                            <h2 className="text-xl font-bold text-red-800">Connection Failed</h2>
                            <p className="text-gray-600 pt-2"> {errorDetail}. Please try again later.</p>
                        </div>
                        <p className="text-sm text-gray-700">
                            Ensure you are connected to the internet, or try reloading the page.
                            If the problem persists, please try to log in again.
                        </p>

                        <Link
                            href="/sign-in"
                            className="text-sm text-white bg-[#4066cf] px-6 py-3 rounded-lg shadow-md transition duration-300 inline-block
                            hover:bg-[#3050a6]"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
