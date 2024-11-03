import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";

export default function Home() {


  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-200 flex flex-col">
        <Header/>

          <MainContent/>
      </div>
  )
}