
import Image from "next/image";
import { Card } from "@/components/ui/card";
import SignInForm from '@/components/SignInForm';

export default function SignInPage() {
  return (
      <div className="min-h-screen flex items-center justify-center p-3 md:p-2
            bg-gradient-to-br from-blue-950 to-blue-200 ">
          <Card className="w-full max-w-4xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                  {/* Image Container */}
                  <div className="relative w-full md:w-1/2 h-52 md:h-auto md:border-r border-gray-200">
                      <Image
                          src="/book-blue.png"
                          alt="Book Image"
                          fill
                          style={{ objectFit: 'cover'}}
                      />
                  </div>

                  {/* SignIn Form Container */}
                  <div className="w-full px-1 md:w-1/2 p-6 md:px-8">
                      <SignInForm/>
                  </div>
              </div>
          </Card>
      </div>
  );
}