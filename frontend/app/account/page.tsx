import Header from "@/components/Header";
import {User} from "@/app/types/User";
import ProfileHeader from "@/app/account/components/ProfileHeader";
import Tabs from "./components/Tabs";

// Mock data for demonstration
const userDataMock: User = {
    id: 1,
  firstName: "Penny",
  lastName: "Smith",
  username: "pennyreads",
  email: "penny@example.com",
  bio: "Bookworm and coffee addict. Always looking for the next great read!",
  profilePicture: "/book.jpg",
  coverPhoto: "/book-signup.jpg",
}

export default function AccountPage() {

  return (
      <div className={"min-h-screen bg-gray-100 bg-gradient-to-br from-blue-950 to-blue-200"}>
        <Header></Header>

        <main className="container mx-auto pt-16 ">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden md:mt-5 md:mx-2 ">
              <div className="" >
                  <ProfileHeader userData={userDataMock} />
              </div>
              <div className="pt-4">
                  <Tabs userData={userDataMock}></Tabs>
              </div>
          </div>

        </main>
      </div>
  )
}