import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

const FloatingHearts = ({ count = 15 }: { count?: number }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    }));
    setHearts(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute text-primary/40"
            style={{ left: `${h.x}%`, bottom: "-20px", fontSize: h.size }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -window.innerHeight - 100],
              opacity: [0, 0.7, 0.7, 0],
              rotate: [0, 10, -10, 15],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            ❤
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHearts;
