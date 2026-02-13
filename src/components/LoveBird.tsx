import { motion } from "framer-motion";

interface LoveBirdProps {
  label: string;
  emoji: string;
  completed?: boolean;
  onClick?: () => void;
  delay?: number;
}

const LoveBird = ({ label, emoji, completed, onClick, delay = 0 }: LoveBirdProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-3 group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`relative w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-lg transition-colors ${
          completed
            ? "bg-primary/20 border-2 border-primary"
            : "bg-card border-2 border-border group-hover:border-primary/50"
        }`}
        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <span>{emoji}</span>
        {completed && (
          <motion.div
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            ✓
          </motion.div>
        )}
      </motion.div>
      <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
        {label}
      </span>
    </motion.button>
  );
};

export default LoveBird;
