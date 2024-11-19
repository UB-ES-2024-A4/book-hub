import Header from "@/components/Header";
import MainContent from "@/app/home/components/MainContent";
import { getAccessToken, getSession } from "../lib/authentication";
import { redirect } from "next/navigation";
import { User } from "../types/User";
import FetchInformationError from "../account/components/Errors/FetchInformationError";

const Home = async() => {

  if(! await getAccessToken())
      redirect("/auth/sign-in");

  const user : User | null = await getSession();


  // Handle error state
  if (!user)
      return (<FetchInformationError error={"Failed to load user information."}/>);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-200 flex flex-col">
        <Header/>
          <MainContent userData={user}/>
      </div>
  )
}

export default Home;