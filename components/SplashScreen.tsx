"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

const NAME = "Peyyfi";

const containerVariants: Variants = {
    hidden: { opacity: 1, scale: 1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
    exit: {
        scale: [1, 1.05, 1],
        opacity: [1, 1, 0],
        transition: {
            duration: 0.6,
            scale: { times: [0, 0.25, 1], ease: "easeOut" },
            opacity: { times: [0, 0.5, 1], ease: "easeOut" },
        },
    },
};

const letterVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.33, 1, 0.68, 1], // cubic out
            y: {
                type: "spring",
                stiffness: 400,
                damping: 12, // gives a slight overshoot like Easing.back(1.5)
            },
        },
    },
};

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
    const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">("enter");

    if (phase === "done") return null;

    return (
        <div style={styles.container}>
            <motion.div
                style={styles.wordRow}
                variants={containerVariants}
                initial="hidden"
                animate={phase === "exit" ? "exit" : "visible"}
                onAnimationComplete={() => {
                    if (phase === "enter") {
                        setPhase("hold");
                        setTimeout(() => setPhase("exit"), 500);
                    } else if (phase === "exit") {
                        setPhase("done");
                        onAnimationComplete();
                    }
                }}
            >
                {NAME.split("").map((letter, i) => (
                    <motion.span
                        key={`${letter}-${i}`}
                        variants={letterVariants}
                        style={styles.letter}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "0 24px",
    },
    wordRow: {
        display: "flex",
    },
    letter: {
        fontSize: 48,
        fontWeight: 700,
        color: "#FFFFFF",
        letterSpacing: "1px",
        display: "inline-block",
    },
};