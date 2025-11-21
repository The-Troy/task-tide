"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Welcome to <span className="text-purple-300">TaskTide</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
            Your personal companion for organizing tasks, staying focused, and
            conquering the semester ahead.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-12 py-6 text-lg font-semibold transition-transform transform hover:scale-105"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}