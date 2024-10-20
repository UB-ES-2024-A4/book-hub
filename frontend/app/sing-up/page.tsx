
import SignUpForm from '@/components/SingUpForm';
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
      <div className="min-h-screen flex items-center justify-center p-10 md:p-2
            bg-gradient-to-br from-blue-950 to-blue-200 ">
          <Card className="w-full max-w-4xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                  {/* Image Container */}
                  <div className="relative w-full md:w-1/2 h-52 md:h-auto md:border-r border-gray-200">
                      <Image
                          src="/coffebook.jpg"
                          alt="Coffee Book"
                          layout="fill"
                          objectFit="cover"
                      />
                  </div>

                  {/* SignUp Form Container */}
                  <div className="w-full md:w-1/2 p-6 md:p-8">
                      <SignUpForm/>
                  </div>
              </div>
          </Card>
      </div>
  );
}