"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
  const letters = "Developed By Greg Feov".split("")

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-black to-slate-900 flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"
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
            className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-lg flex items-center justify-center mx-auto font-display font-bold text-white text-2xl sm:text-3xl shadow-[0_0_30px_-3px_hsl(var(--primary))]"
            animate={{
              boxShadow: [
                "0 0 20px -3px hsl(var(--primary))",
                "0 0 40px 3px hsl(var(--primary))",
                "0 0 20px -3px hsl(var(--primary))",
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
                className="text-2xl sm:text-3xl font-display font-bold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #00f0ff 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
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
              className="w-2 h-2 bg-primary rounded-full"
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
