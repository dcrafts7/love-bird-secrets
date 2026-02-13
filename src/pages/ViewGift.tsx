import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import FloatingHearts from "@/components/FloatingHearts";
import Sparkles from "@/components/Sparkles";
import LoveBird from "@/components/LoveBird";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type View = "reveal" | "hub" | "photos" | "letter" | "promise";

interface Gift {
  id: string;
  token: string;
  creator_name: string;
  lover_name: string;
  letter_text: string | null;
  promise_text: string | null;
  photos_viewed: boolean;
  letter_viewed: boolean;
  promise_viewed: boolean;
}

const ViewGift = () => {
  const { token } = useParams<{ token: string }>();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [view, setView] = useState<View>("reveal");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photosViewed, setPhotosViewed] = useState(false);
  const [letterViewed, setLetterViewed] = useState(false);
  const [promiseViewed, setPromiseViewed] = useState(false);

  useEffect(() => {
    fetchGift();
  }, [token]);

  const fetchGift = async () => {
    if (!token) return;
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (error || !data) {
      setExpired(true);
    } else {
      setGift(data as Gift);
      setPhotosViewed(data.photos_viewed);
      setLetterViewed(data.letter_viewed);
      setPromiseViewed(data.promise_viewed);

      // Load photos
      const { data: photoFiles } = await supabase.storage
        .from("gift-photos")
        .list(data.id);
      if (photoFiles && photoFiles.length > 0) {
        const urls = photoFiles.map(
          (f) =>
            supabase.storage.from("gift-photos").getPublicUrl(`${data.id}/${f.name}`).data.publicUrl
        );
        setPhotos(urls);
      }
    }
    setLoading(false);
  };

  const markViewed = async (section: "photos" | "letter" | "promise") => {
    if (!gift) return;
    const field = `${section}_viewed` as keyof Pick<Gift, "photos_viewed" | "letter_viewed" | "promise_viewed">;

    await supabase
      .from("gifts")
      .update({ [field]: true })
      .eq("id", gift.id);

    if (section === "photos") setPhotosViewed(true);
    if (section === "letter") setLetterViewed(true);
    if (section === "promise") setPromiseViewed(true);

    // Check if all viewed, then delete
    const newState = {
      photos_viewed: section === "photos" ? true : photosViewed,
      letter_viewed: section === "letter" ? true : letterViewed,
      promise_viewed: section === "promise" ? true : promiseViewed,
    };

    if (newState.photos_viewed && newState.letter_viewed && newState.promise_viewed) {
      // Delete photos from storage
      const { data: photoFiles } = await supabase.storage
        .from("gift-photos")
        .list(gift.id);
      if (photoFiles && photoFiles.length > 0) {
        await supabase.storage
          .from("gift-photos")
          .remove(photoFiles.map((f) => `${gift.id}/${f.name}`));
      }
      // Delete gift record
      await supabase.from("gifts").delete().eq("id", gift.id);
    }
  };

  const handleViewSection = async (section: "photos" | "letter" | "promise") => {
    setView(section);
    await markViewed(section);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          💕
        </motion.div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center">
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl mb-4">💔</div>
          <h1 className="text-3xl font-cursive text-gradient mb-3">
            This gift has already been opened
          </h1>
          <p className="text-muted-foreground">
            The love was received and the data has been deleted for privacy.
          </p>
        </motion.div>
      </div>
    );
  }

  const renderReveal = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Sparkles count={25} />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        className="text-7xl mb-6"
      >
        💕
      </motion.div>
      <motion.h1
        className="text-5xl md:text-7xl font-cursive text-gradient mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        I Love You
      </motion.h1>
      <motion.p
        className="text-3xl font-cursive text-primary mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        {gift?.lover_name}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <Button
          onClick={() => setView("hub")}
          className="h-14 px-12 text-xl gradient-primary text-primary-foreground rounded-full shadow-xl"
        >
          Open Your Gift 🎁
        </Button>
      </motion.div>
      <motion.p
        className="text-sm text-muted-foreground mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        From {gift?.creator_name}, with all my love
      </motion.p>
    </motion.div>
  );

  const renderHub = () => (
    <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-4xl font-cursive text-gradient mb-2">Your Love Gift</h2>
      <p className="text-muted-foreground mb-8">Tap each bird to discover your surprise 💕</p>
      <div className="flex justify-center gap-8 flex-wrap">
        <LoveBird
          emoji="📸"
          label="Photos"
          completed={photosViewed}
          onClick={() => handleViewSection("photos")}
          delay={0}
        />
        <LoveBird
          emoji="💌"
          label="Love Letter"
          completed={letterViewed}
          onClick={() => handleViewSection("letter")}
          delay={0.15}
        />
        <LoveBird
          emoji="📜"
          label="Promise"
          completed={promiseViewed}
          onClick={() => handleViewSection("promise")}
          delay={0.3}
        />
      </div>

      <AnimatePresence>
        {photosViewed && letterViewed && promiseViewed && (
          <motion.p
            className="mt-10 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            All gifts have been opened! 💕 This link will no longer work.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderPhotos = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-6">Our Memories</h2>
      <div className="space-y-6">
        {photos.map((url, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <img src={url} alt="" className="w-full rounded-xl" />
            {/* Floating hearts around photo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 5 }).map((_, j) => (
                <motion.span
                  key={j}
                  className="absolute text-primary/60"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    bottom: "10%",
                    fontSize: 14 + Math.random() * 10,
                  }}
                  animate={{
                    y: [0, -100],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 3,
                    repeat: Infinity,
                  }}
                >
                  ❤
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderLetter = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-6">A Letter For You</h2>
      <div className="parchment rounded-lg p-8">
        <p className="text-sm text-muted-foreground italic mb-4">
          Dearest {gift?.lover_name},
        </p>
        <p className="font-body text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {gift?.letter_text}
        </p>
        <p className="text-sm text-muted-foreground italic mt-6 text-right">
          Forever yours, {gift?.creator_name} 💕
        </p>
      </div>
    </motion.div>
  );

  const renderPromise = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-6">A Sacred Promise</h2>
      <div className="parchment rounded-lg p-8 relative">
        {/* Wax seal */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full wax-seal flex items-center justify-center text-xl text-primary-foreground shadow-lg">
          ♥
        </div>
        <p className="text-center text-sm text-muted-foreground italic mb-4 mt-4">
          I, {gift?.creator_name}, hereby promise to {gift?.lover_name}:
        </p>
        <p className="font-body text-foreground/90 whitespace-pre-wrap leading-relaxed text-center">
          {gift?.promise_text}
        </p>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Sealed with love 💕
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen gradient-romantic flex items-center justify-center relative overflow-hidden">
      <FloatingHearts count={15} />
      <div className="relative z-10 px-6 py-12 max-w-lg w-full">
        <AnimatePresence mode="wait">
          {view === "reveal" && renderReveal()}
          {view === "hub" && renderHub()}
          {view === "photos" && renderPhotos()}
          {view === "letter" && renderLetter()}
          {view === "promise" && renderPromise()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViewGift;
