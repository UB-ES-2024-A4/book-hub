import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import {cookies} from "next/headers";

export default function Home() {

    const accessToken = cookies().get('accessToken')?.value;


  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-200 flex flex-col">
        <Header accessToken={accessToken}/>
          <MainContent/>
      </div>
  )
}