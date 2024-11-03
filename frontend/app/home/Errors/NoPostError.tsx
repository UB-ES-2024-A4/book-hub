import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function NoPostError() {
    return(
        // Tarjeta de "No Posts"
        <Card className="mx-20 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex-row items-center">
                <div className="flex items-center space-x-2">
                    <Avatar className="avatar rounded-full">
                        <AvatarImage src="/book-signup.jpg" />
                        <AvatarFallback>NB</AvatarFallback> {/* No Book */}
                    </Avatar>
                    <span className="pl-1 text-transparent bg-clip-text bg-gradient-to-br from-blue-200 to-blue-950">
                        BookHub
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-[200px_1fr] gap-4">
                    <Image
                        alt="Placeholder image for no posts"
                        className="rounded-lg object-cover"
                        width={150}
                        height={190}
                        src="/noposts.png" // Puedes usar una imagen diferente o un ícono de "No Posts"
                    />
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">No Posts Available</h2>
                            <p className="text-gray-600">Stay tuned! New content is on the way.</p>
                        </div>
                        <p className="text-sm text-gray-700">
                            Explore other sections or check back later to see if new posts have been added.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}