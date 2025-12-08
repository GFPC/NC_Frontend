"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function LoadingScreen() {
    const letters = "Developed By Greg Feov".split("")
    const [loadingTextIndex, setLoadingTextIndex] = useState(0)

    const loadingSteps = [
        "Loading events",
        "Loading tickets",
        "Generating page",
        "Optimizing layout",
        "Preparing UI",
        "Final touches"
    ]

    // Смена текста каждые 500мс
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingTextIndex((prev) => (prev + 1) % loadingSteps.length)
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
            {/* Animated bright background elements - оптимизировано для мобильных */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-2xl sm:blur-3xl"
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    style={{ top: "10%", left: "5%" }}
                />
                <motion.div
                    className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-white/3 rounded-full blur-2xl sm:blur-3xl"
                    animate={{
                        x: [0, -60, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    style={{ bottom: "10%", right: "5%" }}
                />
            </div>

            {/* Loading content - адаптировано для мобильных */}
            <div className="relative z-10 text-center w-full max-w-sm px-4">
                <div className="mb-6 sm:mb-8">
                    <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center mx-auto font-display font-bold text-black text-2xl sm:text-3xl shadow-[0_0_30px_8px_rgba(255,255,255,0.4)]"
                        animate={{
                            boxShadow: [
                                "0 0 20px 5px rgba(255,255,255,0.3)",
                                "0 0 40px 12px rgba(255,255,255,0.5)",
                                "0 0 20px 5px rgba(255,255,255,0.3)",
                            ],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    >
                        N
                    </motion.div>
                </div>

                <div className="h-10 sm:h-12 flex items-center justify-center mb-3">
                    <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
                        {letters.map((letter, i) => (
                            <motion.span
                                key={i}
                                className="text-lg sm:text-2xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] tracking-tight"
                                animate={{
                                    y: [0, -6, 0],
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: i * 0.04,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Animated loading text - специально для мобильных */}
                <div className="h-6 mb-2 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={loadingTextIndex}
                            className="text-xs sm:text-sm text-white/70 font-mono tracking-wide"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {loadingSteps[loadingTextIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Loading dots - адаптированы для мобильных */}
                <div className="mt-2 flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.2,
                                delay: i * 0.2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        />
                    ))}
                </div>

                {/* Progress indicator для мобильных */}
                <div className="mt-4">
                    <div className="h-0.5 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                        <motion.div
                            className="h-full bg-gradient-to-r from-white/30 to-white/80 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    {/* Animated React icon with gradient */}
                    <div className="mt-3 flex justify-center">
                        <motion.div
                            className="relative"
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                        >
                            {/* Glowing background */}
                            <motion.div
                                className="absolute -inset-2 rounded-full"
                                animate={{
                                    background: [
                                        "radial-gradient(circle, rgba(0, 216, 255, 0.15) 0%, transparent 70%)",
                                        "radial-gradient(circle, rgba(97, 218, 251, 0.25) 0%, transparent 70%)",
                                        "radial-gradient(circle, rgba(0, 216, 255, 0.15) 0%, transparent 70%)",
                                    ],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            />

                            {/* React icon container */}
                            <div className="relative w-10 h-10">
                                {/* React SVG icon with animated gradient */}
                                <motion.svg
                                    width="40px"
                                    height="40px"
                                    viewBox="0 0 512 512"
                                    className="drop-shadow-[0_0_10px_rgba(0,216,255,0.5)]"
                                >
                                    {/* Animated gradient definition */}
                                    <defs>
                                        <motion.linearGradient
                                            id="react-gradient"
                                            gradientTransform="rotate(90)"
                                            animate={{
                                                x1: ["0%", "100%", "0%"],
                                                x2: ["100%", "0%", "100%"],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        >
                                            <stop offset="0%" stopColor="#00d8ff">
                                                <animate
                                                    attributeName="stop-color"
                                                    values="#00d8ff;#61dafb;#00d8ff"
                                                    dur="3s"
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                            <stop offset="50%" stopColor="#61dafb">
                                                <animate
                                                    attributeName="stop-color"
                                                    values="#61dafb;#00d8ff;#61dafb"
                                                    dur="3s"
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                            <stop offset="100%" stopColor="#00d8ff">
                                                <animate
                                                    attributeName="stop-color"
                                                    values="#00d8ff;#61dafb;#00d8ff"
                                                    dur="3s"
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                        </motion.linearGradient>
                                    </defs>

                                    {/* React logo paths */}
                                    <motion.path
                                        d="M410.66,180.72h0q-7.67-2.62-15.45-4.88,1.29-5.25,2.38-10.56c11.7-56.9,4.05-102.74-22.06-117.83-25-14.48-66,.61-107.36,36.69q-6.1,5.34-11.95,11-3.9-3.76-8-7.36c-43.35-38.58-86.8-54.83-112.88-39.69-25,14.51-32.43,57.6-21.9,111.53q1.58,8,3.55,15.93c-6.15,1.75-12.09,3.62-17.77,5.6C48.46,198.9,16,226.73,16,255.59c0,29.82,34.84,59.72,87.77,77.85q6.44,2.19,13,4.07Q114.64,346,113,354.68c-10,53-2.2,95.07,22.75,109.49,25.77,14.89,69-.41,111.14-37.31q5-4.38,10-9.25,6.32,6.11,13,11.86c40.8,35.18,81.09,49.39,106,34.93,25.75-14.94,34.12-60.14,23.25-115.13q-1.25-6.3-2.88-12.86,4.56-1.35,8.93-2.79c55-18.27,90.83-47.81,90.83-78C496,226.62,462.5,198.61,410.66,180.72Zm-129-81.08c35.43-30.91,68.55-43.11,83.65-34.39h0c16.07,9.29,22.32,46.75,12.22,95.88q-1,4.8-2.16,9.57a487.83,487.83,0,0,0-64.18-10.16,481.27,481.27,0,0,0-40.57-50.75Q276,104.57,281.64,99.64ZM157.73,280.25q6.51,12.6,13.61,24.89,7.23,12.54,15.07,24.71a435.28,435.28,0,0,1-44.24-7.13C146.41,309,151.63,294.75,157.73,280.25Zm0-48.33c-6-14.19-11.08-28.15-15.25-41.63,13.7-3.07,28.3-5.58,43.52-7.48q-7.65,11.94-14.72,24.23T157.7,231.92Zm10.9,24.17q9.48-19.77,20.42-38.78h0q10.93-19,23.27-37.13c14.28-1.08,28.92-1.65,43.71-1.65s29.52.57,43.79,1.66q12.21,18.09,23.13,37t20.69,38.6Q334,275.63,323,294.73h0q-10.91,19-23,37.24c-14.25,1-29,1.55-44,1.55s-29.47-.47-43.46-1.38q-12.43-18.19-23.46-37.29T168.6,256.09ZM340.75,305q7.25-12.58,13.92-25.49h0a440.41,440.41,0,0,1,16.12,42.32A434.44,434.44,0,0,1,326,329.48Q333.62,317.39,340.75,305Zm13.72-73.07q-6.64-12.65-13.81-25h0q-7-12.18-14.59-24.06c15.31,1.94,30,4.52,43.77,7.67A439.89,439.89,0,0,1,354.47,231.93ZM256.23,124.48h0a439.75,439.75,0,0,1,28.25,34.18q-28.35-1.35-56.74,0C237.07,146.32,246.62,134.87,256.23,124.48ZM145.66,65.86c16.06-9.32,51.57,4,89,37.27,2.39,2.13,4.8,4.36,7.2,6.67A491.37,491.37,0,0,0,201,160.51a499.12,499.12,0,0,0-64.06,10q-1.83-7.36-3.3-14.82h0C124.59,109.46,130.58,74.61,145.66,65.86ZM122.25,317.71q-6-1.71-11.85-3.71c-23.4-8-42.73-18.44-56-29.81C42.52,274,36.5,263.83,36.5,255.59c0-17.51,26.06-39.85,69.52-55q8.19-2.85,16.52-5.21a493.54,493.54,0,0,0,23.4,60.75A502.46,502.46,0,0,0,122.25,317.71Zm111.13,93.67c-18.63,16.32-37.29,27.89-53.74,33.72h0c-14.78,5.23-26.55,5.38-33.66,1.27-15.14-8.75-21.44-42.54-12.85-87.86q1.53-8,3.5-16a480.85,480.85,0,0,0,64.69,9.39,501.2,501.2,0,0,0,41.2,51C239.54,405.83,236.49,408.65,233.38,411.38Zm23.42-23.22c-9.72-10.51-19.42-22.14-28.88-34.64q13.79.54,28.08.54c9.78,0,19.46-.21,29-.64A439.33,439.33,0,0,1,256.8,388.16Zm124.52,28.59c-2.86,15.44-8.61,25.74-15.72,29.86-15.13,8.78-47.48-2.63-82.36-32.72-4-3.44-8-7.13-12.07-11a484.54,484.54,0,0,0,40.23-51.2,477.84,477.84,0,0,0,65-10.05q1.47,5.94,2.6,11.64h0C383.81,377.58,384.5,399.56,381.32,416.75Zm17.4-102.64h0c-2.62.87-5.32,1.71-8.06,2.53a483.26,483.26,0,0,0-24.31-60.94,481.52,481.52,0,0,0,23.36-60.06c4.91,1.43,9.68,2.93,14.27,4.52,44.42,15.32,71.52,38,71.52,55.43C475.5,274.19,446.23,298.33,398.72,314.11Z"
                                        fill="url(#react-gradient)"
                                        animate={{
                                            opacity: [0.8, 1, 0.8],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    />
                                    <motion.circle
                                        cx="256"
                                        cy="298.55"
                                        r="43"
                                        fill="url(#react-gradient)"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    />
                                </motion.svg>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Текст Powered by React - мобильный вариант */}
                <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <span className="text-[10px] text-cyan-300/60 font-mono tracking-wider">
                        <span className="text-cyan-400/80">{"<"}</span>
                        <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                            Powered by React
                        </span>
                        <span className="text-cyan-400/80">{"/>"}</span>
                    </span>
                </motion.div>
            </div>

            {/* Мобильные индикаторы (маленькие точки) */}
            <div className="absolute top-4 left-4">
                <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Индикатор времени для мобильных */}
            <motion.div
                className="absolute top-4 text-[10px] text-white/50 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span>LOADING...</span>
            </motion.div>

            {/* Правый верхний индикатор */}
            <div className="absolute top-4 right-4">
                <motion.div
                    className="text-[8px] bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-mono"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    v0.2 latest
                </motion.div>
            </div>
        </div>
    )
}