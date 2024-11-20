import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

export default function FetchError() {
    return (
        // Tarjeta de "Error de Conexión"
        <Card className="bg-white/80 backdrop-blur-sm ">
            <CardContent>
                <div className="grid md:grid-cols-[200px_1fr] gap-4 pt-5">
                    <Image
                        alt="Error placeholder image"
                        className="rounded-lg object-cover"
                        width={150}
                        height={190}
                        src="/noposts.png" // Imagen representativa para errores de conexión
                    />
                    <div className="space-y-4 pt-5">
                        <div>
                            <h2 className="text-xl font-bold text-red-800">Connection Failed</h2>
                            <p className="text-gray-600">We couldn’t connect to the server. Please try again later.</p>
                        </div>
                        <p className="text-sm text-gray-700">
                            Ensure you are connected to the internet, or try reloading the page. If the problem persists, please contact support.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
