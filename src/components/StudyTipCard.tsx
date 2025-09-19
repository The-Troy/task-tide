"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fallbackTips = [
  { text: "💜 Stay consistent — even small steps lead to big results.", author: "TaskTide Team 💜" },
  { text: "📚 Review your notes within 24 hours to boost retention.", author: "TaskTide Team 💜" },
  { text: "⏳ Break study sessions into 25-minute chunks — try the Pomodoro Technique 🍅.", author: "TaskTide Team 💜" },
  { text: "🗣️ Teach what you learn — explaining strengthens memory.", author: "TaskTide Team 💜" },
  { text: "🎯 Focus on mastering concepts, not just passing exams.", author: "TaskTide Team 💜" },
  { text: "📝 Write down your goals — clarity fuels motivation.", author: "TaskTide Team 💜" },
  { text: "📖 Read a little every day — knowledge compounds like interest.", author: "TaskTide Team 💜" },
  { text: "🔄 Mistakes are proof you’re trying — keep going!", author: "TaskTide Team 💜" },
  { text: "📅 Plan your week every Sunday — start strong 💪.", author: "TaskTide Team 💜" },
  { text: "🛌 Rest is productive — your brain consolidates memory while you sleep.", author: "TaskTide Team 💜" },
  { text: "🤝 Collaboration over competition — lift others as you climb.", author: "TaskTide Team 💜" },
  { text: "🌱 Growth takes time — water your efforts daily.", author: "TaskTide Team 💜" },
  { text: "💡 Curiosity is your superpower — ask why, explore how.", author: "TaskTide Team 💜" },
  { text: "🚀 Aim for progress, not perfection.", author: "TaskTide Team 💜" },
  { text: "📂 Keep your notes organized — your future self will thank you.", author: "TaskTide Team 💜" },
  { text: "⏱️ Start early — future deadlines feel lighter.", author: "TaskTide Team 💜" },
  { text: "🏆 Small daily wins add up to big achievements.", author: "TaskTide Team 💜" },
  { text: "🎨 Creativity thrives when you take breaks — go for a walk 🚶.", author: "TaskTide Team 💜" },
  { text: "🧠 Treat your brain like a muscle — train it with challenges.", author: "TaskTide Team 💜" },
  { text: "🧩 Break complex problems into smaller pieces.", author: "TaskTide Team 💜" },
  { text: "🎧 Listen to focus music — your brain loves rhythm 🎶.", author: "TaskTide Team 💜" },
  { text: "💻 Learn a new skill online — knowledge is everywhere now.", author: "TaskTide Team 💜" },
  { text: "📊 Track your progress — see how far you’ve come.", author: "TaskTide Team 💜" },
  { text: "🔥 Motivation gets you started, discipline keeps you going.", author: "TaskTide Team 💜" },
  { text: "🫶 Celebrate even the tiniest wins — you’re building momentum.", author: "TaskTide Team 💜" },
  { text: "🪞 Compare yourself only to who you were yesterday.", author: "TaskTide Team 💜" },
  { text: "🏖️ Take mindful breaks — balance prevents burnout.", author: "TaskTide Team 💜" },
  { text: "🔎 Seek feedback — growth hides in other perspectives.", author: "TaskTide Team 💜" },
  { text: "💜 Believe in yourself even when results are slow.", author: "TaskTide Team 💜" },
  { text: "🧃 Stay hydrated — your brain works better with water.", author: "TaskTide Team 💜" },
  { text: "🪴 Plant seeds of effort daily — your future blooms 🌸.", author: "TaskTide Team 💜" },
  { text: "🛠️ Build habits, not just motivation.", author: "TaskTide Team 💜" },
  { text: "📑 Summarize after reading — retention skyrockets 🚀.", author: "TaskTide Team 💜" },
  { text: "🎓 Education is an investment — treat it seriously.", author: "TaskTide Team 💜" },
  { text: "💬 Ask questions — curiosity is free wisdom.", author: "TaskTide Team 💜" },
  { text: "📆 Consistency beats cramming every single time.", author: "TaskTide Team 💜" },
  { text: "🖊️ Rewrite notes in your own words — your brain loves this.", author: "TaskTide Team 💜" },
  { text: "🏃 Move a little before studying — boost brain activity.", author: "TaskTide Team 💜" },
  { text: "🌟 You don’t have to be perfect to be proud.", author: "TaskTide Team 💜" },
  { text: "🎯 One focused hour beats three distracted ones.", author: "TaskTide Team 💜" },
  { text: "📚 Read widely — connect dots across fields.", author: "TaskTide Team 💜" },
  { text: "🪞 Reflect weekly — what worked, what didn’t?", author: "TaskTide Team 💜" },
  { text: "⚡ Act on ideas quickly — momentum fades fast.", author: "TaskTide Team 💜" },
  { text: "🔐 Protect your time like treasure — it is!", author: "TaskTide Team 💜" },
  { text: "🧘 Breathe deeply before exams — calm fuels clarity.", author: "TaskTide Team 💜" },
  { text: "🎙️ Explain concepts aloud — you’ll find gaps faster.", author: "TaskTide Team 💜" },
  { text: "📖 A page a day still finishes a book.", author: "TaskTide Team 💜" },
  { text: "💜 You’re smarter than you think — keep going!", author: "TaskTide Team 💜" },
  { text: "🌍 Learn something outside your field — expand your mind.", author: "TaskTide Team 💜" },
  { text: "🎓 The best project you can work on is yourself.", author: "TaskTide Team 💜" },
  { text: "⏲️ Deadlines are motivators — use them wisely.", author: "TaskTide Team 💜" },
  { text: "🌞 Mornings are your brain’s prime time — use them.", author: "TaskTide Team 💜" },
  { text: "🧠 Your brain is plastic — train it, reshape it.", author: "TaskTide Team 💜" },
  { text: "📋 Prioritize — not all tasks deserve equal attention.", author: "TaskTide Team 💜" },
  { text: "📢 Share what you learn — knowledge grows when shared.", author: "TaskTide Team 💜" },
  { text: "💡 Think in systems, not just goals.", author: "TaskTide Team 💜" },
  { text: "🔄 If you fail, try again differently — iterate.", author: "TaskTide Team 💜" },
  { text: "🌸 Rest is part of the process, not a break from it.", author: "TaskTide Team 💜" },
  { text: "🛑 Say no to distractions — say yes to your goals.", author: "TaskTide Team 💜" },
  { text: "🌊 Ride the waves of energy — work when you feel sharp.", author: "TaskTide Team 💜" },
  { text: "🗓️ Schedule breaks like appointments — they matter.", author: "TaskTide Team 💜" },
  { text: "🖥️ Learn one new shortcut every week — save time.", author: "TaskTide Team 💜" },
  { text: "⚖️ Balance ambition with patience — success compounds.", author: "TaskTide Team 💜" },
  { text: "💬 Find a mentor — learn from their journey.", author: "TaskTide Team 💜" },
  { text: "🏗️ Build projects — applying knowledge cements it.", author: "TaskTide Team 💜" },
  { text: "📦 Done is better than perfect — ship your work.", author: "TaskTide Team 💜" },
  { text: "✨ Every day is a chance to rewrite your story.", author: "TaskTide Team 💜" },
  { text: "🌙 Sleep well — tired brains don’t perform miracles.", author: "TaskTide Team 💜" },
  { text: "🧩 Learn actively — quiz yourself, don’t just reread.", author: "TaskTide Team 💜" },
  { text: "📈 Track habits — data keeps you honest.", author: "TaskTide Team 💜" },
  { text: "💜 Your effort today is building tomorrow’s you.", author: "TaskTide Team 💜" },
  { text: "🕰️ Don’t wait for motivation — start, and motivation follows.", author: "TaskTide Team 💜" },
  { text: "🎶 Study playlists boost focus — try lo-fi or classical.", author: "TaskTide Team 💜" },
  { text: "🏔️ Big goals? Break them into daily climbs.", author: "TaskTide Team 💜" },
  { text: "🎯 Focus is the new superpower — eliminate noise.", author: "TaskTide Team 💜" },
  { text: "💡 Document your learnings — build your second brain.", author: "TaskTide Team 💜" },
  { text: "👣 Start small, start now — momentum builds confidence.", author: "TaskTide Team 💜" },
  { text: "🔑 Consistency unlocks results — don’t give up.", author: "TaskTide Team 💜" },
];

const gradients = [
  "bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100",
  "bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100",
  "bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100",
  "bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100",
  "bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100",
  "bg-gradient-to-r from-rose-100 via-purple-100 to-sky-100",
];

export default function StudyTipCard() {
  const [quote, setQuote] = useState(fallbackTips[0].text);
  const [author, setAuthor] = useState(fallbackTips[0].author);
  const [gradient, setGradient] = useState(gradients[0]);

  function getRandomQuote() {
    const randomQuote = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    setQuote(randomQuote.text);
    setAuthor(randomQuote.author);
    setGradient(randomGradient);
  }

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <motion.div
      className={`mt-8 p-6 rounded-2xl shadow-xl ${gradient}`}
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
          src="/images/study-tip.jpg"
          alt="Study tip illustration"
          width={250}
          height={180}
          className="rounded object-cover shadow-md"
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
