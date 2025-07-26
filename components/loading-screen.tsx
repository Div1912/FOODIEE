"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentText, setCurrentText] = useState("")
  const fullText = "INSTA BITE"
  const slogan = "Delivering Happiness in a Bite"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setCurrentText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
        setTimeout(onComplete, 1500)
      }
    }, 150)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-4 font-poppins"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentText}
          <motion.span
            className="inline-block w-1 h-16 bg-white ml-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90 font-roboto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {slogan}
        </motion.p>

        {/* Animated food icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                y: -50,
                rotate: 0,
                opacity: 0.7,
              }}
              animate={{
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {["🍕", "🍔", "🍜", "🍱", "🥘"][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
