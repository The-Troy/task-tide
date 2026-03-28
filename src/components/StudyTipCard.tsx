"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const tips = [
  "Your learning journey is unique — trust the process.",
  "Start where you are, use what you have, do what you can.",
  "Journaling your progress makes you more mindful.",
  "Focus on quality over quantity — deep work wins.",
  "One goal at a time — multitasking drains focus.",
  "Done is better than perfect — progress matters.",
  "Stretch your brain with a puzzle or riddle today.",
  "Practice daily — coding is a muscle too!",
  "Slow down when reading — understanding beats speed.",
  "Mistakes are fertilizer — they help you grow.",
  "Know your why — it fuels your study sessions.",
  "The best time to start was yesterday. The next best time is now.",
  "Calm mind = sharp mind — breathe for a minute before you start.",
  "Build streaks — consistency is addictive.",
  "Add colour to your notes — visual memory is powerful.",
  "Small consistent actions beat rare bursts of effort.",
  "Teach a friend — you'll learn twice.",
  "Break big projects into micro-tasks and celebrate each step.",
  "Visualise success — your brain works toward what it sees.",
  "Preparation unlocks confidence before exams.",
  "Reread with intention — look for something new each time.",
  "Keep a question notebook — curiosity grows knowledge.",
  "A good night's sleep is your secret study hack.",
  "Start early, finish early — reward yourself with free time.",
  "Repetition is the mother of learning.",
  "Exercise boosts memory and learning ability.",
  "Keep a balance — mental health fuels productivity.",
  "Write down distractions — deal with them later.",
  "Every day is a fresh page — write something amazing.",
  "Build knowledge brick by brick, day by day.",
  "Memory improves with active recall — quiz yourself often.",
  "Recharge before you burn out — breaks are batteries.",
  "Hard work compounds — you're building a future you.",
  "Link new ideas to what you already know — memory loves connections.",
  "Your effort today is an investment in tomorrow.",
];

const images = [
  "/images/study-tips/tip1.jpg",
  "/images/study-tips/tip2.jpg",
  "/images/study-tips/tip3.jpg",
  "/images/study-tips/tip4.jpg",
  "/images/study-tips/tip5.jpg",
  "/images/study-tips/tip6.jpg",
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function StudyTipCard() {
  const [tip, setTip] = useState(tips[0]);
  const [image, setImage] = useState(images[0]);

  function next() {
    setTip(random(tips));
    setImage(random(images));
  }

  useEffect(() => { next(); }, []);

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            Study Tip of the Day
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={next} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            New tip
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* Image */}
          <div className="shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image}
                  alt="Study illustration"
                  width={120}
                  height={120}
                  className="rounded-xl object-cover w-[120px] h-[120px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={tip}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-base text-foreground leading-relaxed italic">
                    &ldquo;{tip}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    — TaskTide Team
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
