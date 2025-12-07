"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
  const letters = "Developed By Greg Feov".split("")

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Animated bright background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-white/3 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ bottom: "10%", right: "5%" }}
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-12">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center mx-auto font-display font-bold text-black text-2xl sm:text-3xl shadow-[0_0_40px_10px_rgba(255,255,255,0.5)]"
            animate={{
              boxShadow: [
                "0 0 30px 5px rgba(255,255,255,0.4)",
                "0 0 60px 15px rgba(255,255,255,0.6)",
                "0 0 30px 5px rgba(255,255,255,0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            N
          </motion.div>
        </div>

        <div className="h-16 flex items-center justify-center">
          <div className="flex gap-1">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-8 flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
