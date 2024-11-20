import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

export default function SearchHome() {
    return (
            <div className="w-full md:w-1/4 border-r shadow-black shadow-2xl p-4 flex flex-col">

                <div className="sticky top-0 pt-10">
                    <div className="relative">
                        <Input className="w-full pl-8 text-white bg-blue-900/50" placeholder="Search User"/>
                        <Search className="absolute top-3 left-2 w-4 h-4 text-white"/>
                    </div>
                </div>
            </div>
)
}
