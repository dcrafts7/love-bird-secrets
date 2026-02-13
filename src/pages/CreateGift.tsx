import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import FloatingHearts from "@/components/FloatingHearts";
import LoveBird from "@/components/LoveBird";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, X } from "lucide-react";

type View = "hub" | "photos" | "letter" | "promise" | "done";

const CreateGift = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { yourName, loverName } = (location.state as { yourName: string; loverName: string }) || {};

  const [view, setView] = useState<View>("hub");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [letter, setLetter] = useState("");
  const [promise, setPromise] = useState("");
  const [loading, setLoading] = useState(false);
  const [giftLink, setGiftLink] = useState("");

  if (!yourName || !loverName) {
    navigate("/");
    return null;
  }

  const photosComplete = photos.length >= 1;
  const letterComplete = letter.trim().length > 0;
  const promiseComplete = promise.trim().length > 0;
  const allComplete = photosComplete && letterComplete && promiseComplete;

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotosPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Create gift record
      const { data: gift, error: giftError } = await supabase
        .from("gifts")
        .insert({
          creator_name: yourName,
          lover_name: loverName,
          letter_text: letter,
          promise_text: promise,
        })
        .select()
        .single();

      if (giftError || !gift) throw giftError;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const path = `${gift.id}/${i}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("gift-photos")
          .upload(path, file);
        if (uploadError) throw uploadError;
      }

      const link = `${window.location.origin}/gift/${gift.token}`;
      setGiftLink(link);
      setView("done");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(giftLink);
    toast({ title: "Copied!", description: "Link copied to clipboard 💕" });
  };

  const renderHub = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-cursive text-gradient mb-2">
        Your Love Gift
      </h1>
      <p className="text-muted-foreground mb-8">
        Fill each bird with love for {loverName} 💕
      </p>

      <div className="flex justify-center gap-8 mb-10 flex-wrap">
        <LoveBird
          emoji="📸"
          label="Photos"
          completed={photosComplete}
          onClick={() => setView("photos")}
          delay={0}
        />
        <LoveBird
          emoji="💌"
          label="Love Letter"
          completed={letterComplete}
          onClick={() => setView("letter")}
          delay={0.15}
        />
        <LoveBird
          emoji="📜"
          label="Promise"
          completed={promiseComplete}
          onClick={() => setView("promise")}
          delay={0.3}
        />
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {[photosComplete, letterComplete, promiseComplete].map((done, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              done ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="h-12 px-10 text-lg gradient-primary text-primary-foreground rounded-full shadow-lg"
            >
              {loading ? "Creating..." : "Generate Gift Link 🎁"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderPhotos = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-4">Upload Photos</h2>
      <p className="text-muted-foreground mb-6">Add up to 5 romantic photos ({photos.length}/5)</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {photosPreviews.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {photos.length < 5 && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-colors text-3xl text-primary/40">
            +
            <Input type="file" accept="image/*" multiple onChange={handlePhotoAdd} className="hidden" />
          </label>
        )}
      </div>
    </motion.div>
  );

  const renderLetter = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-4">Love Letter</h2>
      <p className="text-muted-foreground mb-6">Write your heart out to {loverName} ✨</p>
      <Textarea
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        placeholder="My dearest love..."
        className="min-h-[250px] parchment font-body text-foreground/90 resize-none"
      />
    </motion.div>
  );

  const renderPromise = () => (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
      <button onClick={() => setView("hub")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>
      <h2 className="text-3xl font-cursive text-gradient mb-4">Promise Contract</h2>
      <p className="text-muted-foreground mb-6">Make a solemn promise to {loverName} 🤝</p>
      <div className="parchment p-6 rounded-lg">
        <p className="text-center text-sm text-muted-foreground mb-4 italic">
          I, {yourName}, hereby promise to {loverName}:
        </p>
        <Textarea
          value={promise}
          onChange={(e) => setPromise(e.target.value)}
          placeholder="I promise to always..."
          className="min-h-[200px] bg-transparent border-none font-body resize-none focus-visible:ring-0"
        />
        <p className="text-center text-xs text-muted-foreground mt-4">
          Signed with love, {yourName} 💕
        </p>
      </div>
    </motion.div>
  );

  const renderDone = () => (
    <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-4xl font-cursive text-gradient mb-4">Gift Created!</h2>
      <p className="text-muted-foreground mb-6">
        Share this link with {loverName}. It can only be opened once!
      </p>
      <div className="bg-card border border-border rounded-lg p-4 mb-4 flex items-center gap-2">
        <span className="flex-1 text-sm break-all text-left text-foreground/80">{giftLink}</span>
        <Button variant="outline" size="icon" onClick={copyLink}>
          <Copy size={16} />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        ⚠️ This link is single-use. All data is deleted after viewing.
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen gradient-romantic flex items-center justify-center relative overflow-hidden">
      <FloatingHearts count={10} />
      <div className="relative z-10 px-6 py-12 max-w-lg w-full">
        <AnimatePresence mode="wait">
          {view === "hub" && renderHub()}
          {view === "photos" && renderPhotos()}
          {view === "letter" && renderLetter()}
          {view === "promise" && renderPromise()}
          {view === "done" && renderDone()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateGift;
