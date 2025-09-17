"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fallbackTips = [
  { text: "Stay consistent, even small steps lead to big results.", author: "TaskTide Wisdom" },
  { text: "Review your notes within 24 hours to boost retention.", author: "TaskTide Wisdom" },
  { text: "Break study sessions into 25-minute chunks — use the Pomodoro Technique.", author: "TaskTide Wisdom" },
  { text: "Teach what you learn — explaining strengthens memory.", author: "TaskTide Wisdom" },
];

export default function StudyTipCard() {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0); // forces re-render for animation

  async function fetchQuote() {
    setLoading(true);
    try {
      const res = await fetch("https://api.quotable.io/random?tags=education|motivational", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
      setKey((prev) => prev + 1); // update key to trigger animation
    } catch (error) {
      console.warn("⚠️ Could not fetch quote. Using fallback.", error);
      const randomFallback = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
      setQuote(randomFallback.text);
      setAuthor(randomFallback.author);
      setKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  // Fetch quote on initial render
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="mt-8 p-6 bg-card rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-primary">Study Tip of the Day</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuote}
          disabled={loading}
        >
          {loading ? "Loading..." : "New Quote"}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Fetching your study tip...</p>
      ) : (
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Image
            src="/images/study-tip.jpg" // <-- Your static image here
            alt="Study tip illustration"
            width={250}
            height={180}
            className="rounded object-cover"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-foreground italic">"{quote}"</p>
              <p className="text-sm text-muted-foreground mt-2">- {author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
