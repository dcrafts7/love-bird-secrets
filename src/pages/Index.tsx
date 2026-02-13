import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [yourName, setYourName] = useState("");
  const [loverName, setLoverName] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!yourName.trim() || !loverName.trim()) return;
    navigate("/create", {
      state: { yourName: yourName.trim(), loverName: loverName.trim() },
    });
  };

  return (
    <div className="min-h-screen gradient-romantic flex items-center justify-center relative overflow-hidden">
      <FloatingHearts count={20} />
      <Sparkles count={15} />

      <motion.div
        className="relative z-10 text-center px-6 max-w-md w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          💕
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-cursive text-gradient mb-3">
          Love Birds
        </h1>
        <p className="text-muted-foreground mb-8 text-lg font-body">
          Create a beautiful Valentine's surprise for your loved one
        </p>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5 text-left">
              Your Name
            </label>
            <Input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5 text-left">
              Your Lover's Name
            </label>
            <Input
              value={loverName}
              onChange={(e) => setLoverName(e.target.value)}
              placeholder="Enter their name..."
              className="bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={!yourName.trim() || !loverName.trim()}
          className="w-full h-12 text-lg font-semibold gradient-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          Create Gift 💝
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
