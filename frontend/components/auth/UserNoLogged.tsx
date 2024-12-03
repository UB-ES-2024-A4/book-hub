'use client'
import Image from 'next/image'
import Link from 'next/link'
import {AnimatePresence, motion} from 'framer-motion'
import { useEffect, useState } from 'react'
import {ChevronLeft, ChevronRight} from "lucide-react";

export default function UserNoLogged() {
    const [displayText, setDisplayText] = useState('')
    const fullText = "Your personal book community awaits!"

    useEffect(() => {
        let currentText = ''
        let index = 0
        const typingInterval = setInterval(() => {
            if (index < fullText.length) {
                currentText += fullText[index]
                setDisplayText(currentText)
                index++
            } else {
                clearInterval(typingInterval)
            }
        }, 70)

        return () => clearInterval(typingInterval)
    }, [])


const features = [
  {
    title: "Descubre Lecturas",
    description: "Explora publicaciones de otros usuarios y encuentra inspiración para tu próxima lectura.",
    image: "/users_main.png"
  },
  {
    title: "Comparte tus Libros",
    description: "Publica tus lecturas actuales, reseñas y progreso de lectura.",
    image: "/create_post_main.png",
  },
  {
    title: "Conecta con Lectores",
    description: "Sigue a otros usuarios y crea tu propia comunidad de lectura.",
    image: "/follow_main.png"
  },
  {
    title: "Rastrea tu Progreso",
    description: "Lleva un registro de tus libros leídos y establece metas de lectura.",
    image: "/users_main.png"
  }
]
const [currentFeature, setCurrentFeature] = useState(0)

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)
  }

    return (
        <div className="relative min-h-screen bg-gradient-to-br bg-[#051B32] overflow-hidden pb-2 mb-4">
            {/* Floating Book Icons Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: -100, rotate: Math.random() * 360
                        }}
                        animate={{
                            y: window.innerHeight + 100,
                            rotate: Math.random() * 360
                        }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: 'loop'
                        }}
                        className="absolute"
                    >
                        <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24"/>
                            <path d="M12 6.90909C10.8999 5.50893 9.20406 4.10877 5.00119 4.00602C4.72513 3.99928 4.5
                            4.22351 4.5 4.49965C4.5 6.54813 4.5 14.3034 4.5 16.597C4.5 16.8731 4.72515 17.09 5.00114
                            17.099C9.20405 17.2364 10.8999 19.0998 12 20.5M12 6.90909C13.1001 5.50893 14.7959 4.10877
                            18.9988 4.00602C19.2749 3.99928 19.5 4.21847 19.5 4.49461C19.5 6.78447 19.5 14.3064 19.5
                            16.5963C19.5 16.8724 19.2749 17.09 18.9989 17.099C14.796 17.2364 13.1001 19.0998 12 20.5M12 6.90909L12 20.5"
                                  stroke="#8dc5fe" stroke-linejoin="round"/>
                            <path
                                d="M19.2353 6H21.5C21.7761 6 22 6.22386 22 6.5V19.539C22 19.9436 21.5233 20.2124 21.1535 20.0481C20.3584 19.6948 19.0315 19.2632 17.2941 19.2632C14.3529 19.2632 12 21 12 21C12 21 9.64706 19.2632 6.70588 19.2632C4.96845 19.2632 3.64156 19.6948 2.84647 20.0481C2.47668 20.2124 2 19.9436 2 19.539V6.5C2 6.22386 2.22386 6 2.5 6H4.76471"
                                stroke="#8dc5fe" stroke-linejoin="round"/>
                        </svg>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen px-4 lg:flex-row lg:space-x-16">
                {/* Welcome Section */}
                <div className="relative z-10 flex flex-col justify-center w-full max-w-md pt-20 md:pt-0">
                    <motion.div
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1.7}}
                        className="sm:mx-auto w-full"
                    >
                        <div className="flex justify-center mb-6">
                            <motion.div
                                whileHover={{scale: 1.1}}
                                transition={{type: "spring", stiffness: 300}}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="BookHub Logo"
                                    width={80}
                                    height={80}
                                    className="rounded-full shadow-lg bg-white p-2"
                                />
                            </motion.div>
                        </div>

                        <motion.h2
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 2.5}}
                            className="text-center text-4xl font-bold text-blue-600 mb-4"
                        >
                            Welcome to BookHub
                        </motion.h2>

                        <p className="mt-2 text-center text-md text-gray-500 mb-8">
                            {displayText}
                        </p>

                        <div className="flex justify-center space-x-4">
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Link
                                    href="/sign-in"
                                    className="text-white bg-[#4066cf] px-6 py-3 rounded-lg shadow-md transition duration-300 inline-block
                                    hover:bg-[#3050a6]"
                                >
                                    Sign In
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Link
                                    href="/sign-up"
                                    className="text-white bg-green-500 px-6 py-3 rounded-lg shadow-md transition duration-300 inline-block
                                    hover:bg-green-600"
                                >
                                    Sign Up
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Carousel Section */}
                <div className="relative w-full max-w-md mt-8 lg:mt-0 items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentFeature}
                            initial={{opacity: 0, x: 100}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -100}}
                            transition={{duration: 0.3}}
                            className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-xl w-full max-w-md h-auto"
                        >
                            <div className="flex mb-6" style={{maxHeight: "160px"}}>
                                <Image
                                    src={features[currentFeature].image}
                                    alt={features[currentFeature].title}
                                    width={800}
                                    height={800}
                                    className="object-contain  rounded-sm"
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center">
                                {features[currentFeature].title}
                            </h3>
                            <p className="text-md text-gray-400 text-center">
                                {features[currentFeature].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={prevFeature}
                            className="bg-white/50 hover:bg-white/70 p-2 rounded-full"
                        >
                            <ChevronLeft className="text-gray-700"/>
                        </motion.button>
                        <motion.button
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            onClick={nextFeature}
                            className="bg-white/50 hover:bg-white/70 p-2 rounded-full"
                        >
                            <ChevronRight className="text-gray-700"/>
                        </motion.button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {features.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{scale: 1}}
                                animate={{
                                    scale: index === currentFeature ? 1.3 : 1,
                                    backgroundColor: index === currentFeature ? '#4066cf' : '#D1D5DB'
                                }}
                                transition={{duration: 0.2}}
                                className={`h-2 w-2 rounded-full cursor-pointer `}
                                onClick={() => setCurrentFeature(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        )
}