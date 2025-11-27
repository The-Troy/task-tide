"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fallbackTips = [
{ text: "🌟 Your learning journey is unique — trust the process.", author: "TaskTide Team 💜" },
  { text: "🚦 Start where you are, use what you have, do what you can.", author: "TaskTide Team 💜" },
  { text: "🖋️ Journaling your progress makes you more mindful.", author: "TaskTide Team 💜" },
  { text: "🔍 Focus on quality over quantity — deep work wins.", author: "TaskTide Team 💜" },
  { text: "🎯 One goal at a time — multitasking drains focus.", author: "TaskTide Team 💜" },
  { text: "🧃 Water + Brain = Productivity Boost 💡", author: "TaskTide Team 💜" },
  { text: "🏁 Done is better than perfect — progress matters.", author: "TaskTide Team 💜" },
  { text: "🧠 Stretch your brain with a puzzle or riddle today.", author: "TaskTide Team 💜" },
  { text: "💻 Practice daily — coding is a muscle too!", author: "TaskTide Team 💜" },
  { text: "📖 Slow down when reading — understanding > speed.", author: "TaskTide Team 💜" },
  { text: "🌱 Mistakes are fertilizer — they help you grow.", author: "TaskTide Team 💜" },
  { text: "🎧 Use soundscapes or white noise to focus better.", author: "TaskTide Team 💜" },
  { text: "🧭 Know your why — it fuels your study sessions.", author: "TaskTide Team 💜" },
  { text: "⏰ The best time to start was yesterday. The next best time is now.", author: "TaskTide Team 💜" },
  { text: "🧘 Calm mind = sharp mind — breathe for a minute before you start.", author: "TaskTide Team 💜" },
  { text: "📆 Build streaks — consistency is addictive.", author: "TaskTide Team 💜" },
  { text: "🎨 Add color to your notes — visual memory is powerful.", author: "TaskTide Team 💜" },
  { text: "🚀 Small consistent actions beat rare bursts of effort.", author: "TaskTide Team 💜" },
  { text: "💬 Teach a friend — you'll learn twice.", author: "TaskTide Team 💜" },
  { text: "📦 Break big projects into micro-tasks and celebrate each step 🎉.", author: "TaskTide Team 💜" },
  { text: "🖼️ Visualize success — your brain works toward what it sees.", author: "TaskTide Team 💜" },
  { text: "🔑 Preparation unlocks confidence before exams.", author: "TaskTide Team 💜" },
  { text: "🧃 Snack smart — fuel your focus, not just your hunger.", author: "TaskTide Team 💜" },
  { text: "📚 Reread with intention — look for something new each time.", author: "TaskTide Team 💜" },
  { text: "🧠 Keep a 'question notebook' — curiosity grows knowledge.", author: "TaskTide Team 💜" },
  { text: "🎯 Focused action today makes tomorrow easier.", author: "TaskTide Team 💜" },
  { text: "🌙 A good night’s sleep is your secret study hack.", author: "TaskTide Team 💜" },
  { text: "🕰️ Start early, finish early — reward yourself with free time.", author: "TaskTide Team 💜" },
  { text: "💡 Experiment with study methods until one clicks.", author: "TaskTide Team 💜" },
  { text: "🎶 Try instrumental playlists — lyrics can distract.", author: "TaskTide Team 💜" },
  { text: "📖 Repetition is the mother of learning.", author: "TaskTide Team 💜" },
  { text: "🚴 Exercise boosts memory and learning ability 🧠.", author: "TaskTide Team 💜" },
  { text: "🌍 Learn about something outside your comfort zone today.", author: "TaskTide Team 💜" },
  { text: "🧩 Keep a balance — mental health fuels productivity.", author: "TaskTide Team 💜" },
  { text: "📌 Write down distractions — deal with them later.", author: "TaskTide Team 💜" },
  { text: "✨ Every day is a fresh page — write something amazing.", author: "TaskTide Team 💜" },
  { text: "🏗️ Build knowledge brick by brick, day by day.", author: "TaskTide Team 💜" },
  { text: "🌞 Morning review sets the tone for the day.", author: "TaskTide Team 💜" },
  { text: "📊 Measure your progress weekly — celebrate growth!", author: "TaskTide Team 💜" },
  { text: "🧠 Memory improves with active recall — quiz yourself often.", author: "TaskTide Team 💜" },
  { text: "🔋 Recharge before you burn out — breaks are batteries.", author: "TaskTide Team 💜" },
  { text: "🚧 Hard work compounds — you’re building a future you.", author: "TaskTide Team 💜" },
  { text: "📎 Link new ideas to what you already know — memory loves connections.", author: "TaskTide Team 💜" },
  { text: "🧃 Stay refreshed — brain fog is just dehydration in disguise.", author: "TaskTide Team 💜" },
  { text: "🎯 Your effort today is an investment in tomorrow.", author: "TaskTide Team 💜" },
];



// ✅ List of images (add them in /public/images/study-tips/)
const images = [
  "/images/study-tips/tip1.jpg",
  "/images/study-tips/tip2.jpg",
  "/images/study-tips/tip3.jpg",
  "/images/study-tips/tip4.jpg",
  "/images/study-tips/tip5.jpg",
  "/images/study-tips/tip6.jpg",
];

export default function StudyTipCard() {
  const [quote, setQuote] = useState(fallbackTips[0].text);
  const [author, setAuthor] = useState(fallbackTips[0].author);
  const [image, setImage] = useState(images[0]);

  function getRandomQuote() {
    const randomQuote = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];

    setQuote(randomQuote.text);
    setAuthor(randomQuote.author);
    setImage(randomImage);
  }

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <motion.div
      className="mt-8 p-6 rounded-2xl shadow-xl bg-[#26415E]"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-primary">💜 Study Tip of the Day</h3>
        <Button variant="outline" size="sm" onClick={getRandomQuote}>
          🔄 New Quote
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Image
          src={image}
          alt="Study tip illustration"
          width={200}
          height={200}
          className="rounded-full object-cover shadow-md"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={quote}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-foreground italic text-lg">{quote}</p>
            <p className="text-sm text-muted-foreground mt-2">{author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
