"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { PowerServiceIcon } from "@hugeicons/core-free-icons";

export function MaintenanceScreen() {
    return (
        <div style={styles.container}>
            <motion.div
                style={styles.card}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Huge PowerServiceIcon */}
                <div style={styles.iconWrap}>
                    <HugeiconsIcon
                        icon={PowerServiceIcon}
                        size={96}
                        color="#EAB308"
                        strokeWidth={1.5}
                    />
                </div>

                <h1 style={styles.title}>Peyyfi</h1>
                <p style={styles.subtitle}>
                    Application will launch under the name <strong>Peyyfi</strong>.
                    <br />
                    System is currently under maintenance.
                    <br />
                    Will be live soon.
                </p>
            </motion.div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "0 24px",
        textAlign: "center",
    },
    card: {
        maxWidth: 420,
        width: "100%",
    },
    iconWrap: {
        width: 120,
        height: 120,
        borderRadius: "50%",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
    },
    title: {
        fontSize: 36,
        fontWeight: 700,
        color: "#FFFFFF",
        marginBottom: 16,
        letterSpacing: "1px",
    },
    subtitle: {
        fontSize: 16,
        color: "#9CA3AF",
        lineHeight: 1.7,
    },
};