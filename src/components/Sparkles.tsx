import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const Sparkles = ({ count = 20 }: { count?: number }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 3,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle text-gold"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

export default Sparkles;
