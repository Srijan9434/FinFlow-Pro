import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Wallet, Sparkles, ArrowRight } from "lucide-react";

const KEY = "ff_welcomed";

export function WelcomeScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionStorage.getItem(KEY)) setShow(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden cursor-pointer"
          onClick={dismiss}
          style={{
            background:
              "radial-gradient(at 30% 20%, oklch(0.4 0.18 280 / 0.7), transparent 50%), radial-gradient(at 70% 80%, oklch(0.45 0.2 160 / 0.6), transparent 50%), oklch(0.12 0.03 265)",
          }}
        >
          {/* floating orbs */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl"
              style={{
                width: 60 + (i % 4) * 30,
                height: 60 + (i % 4) * 30,
                left: `${(i * 73) % 100}%`,
                top: `${(i * 47) % 100}%`,
                background:
                  i % 2
                    ? "oklch(0.72 0.18 160 / 0.35)"
                    : "oklch(0.7 0.2 280 / 0.35)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="relative text-center px-6 max-w-2xl">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              className="inline-grid place-items-center size-20 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/40 mb-6"
            >
              <Wallet className="size-10 text-primary-foreground" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs mb-5 border border-white/20"
            >
              <Sparkles className="size-3 text-primary" /> Welcome to the future of finance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight"
            >
              FinFlow{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_3s_linear_infinite]">
                Pro
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-5 text-lg text-white/70 max-w-md mx-auto"
            >
              Track every rupee. Visualize every category. Export every report.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={dismiss}
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow"
            >
              Get Started <ArrowRight className="size-5" />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-xs text-white/40"
            >
              Click anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
