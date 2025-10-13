"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookMarked,
  LogIn,
  Users,
  CalendarCheck,
  MessageSquare,
  Search,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [counters, setCounters] = useState({
    students: 0,
    documents: 0,
    groups: 0,
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let interval = setInterval(() => {
      setCounters((prev) => {
        if (prev.students < 500) {
          return {
            students: prev.students + 10,
            documents: prev.documents + 20,
            groups: prev.groups + 1,
          };
        }
        clearInterval(interval);
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isInView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Smart Search & Filtering",
      description: "Find documents by semester, unit, or tags instantly.",
    },
    {
      icon: <CalendarCheck className="h-8 w-8 text-primary" />,
      title: "Deadlines & Reminders",
      description: "Stay on top of assignments with automated reminders.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Group Collaboration",
      description:
        "Chat, share files, and work together on assignments in one place.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Shared Academic Calendar",
      description: "Track classes, exams, and project timelines with ease.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      role: "Class Representative",
      quote:
        "TaskTide has made managing and sharing notes with my class so much easier!",
    },
    {
      name: "Brian M.",
      role: "University Student",
      quote: "I love the reminders — I never miss a deadline anymore.",
    },
    {
      name: "Dr. Achieng",
      role: "Lecturer",
      quote:
        "A great tool to keep students organized and engaged with coursework.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary">
          <BookMarked className="h-8 w-8" />
          <span className="font-headline">TaskTide</span>
        </div>
        <Button asChild variant="outline">
          <Link href="/login">
            Go to App
            <LogIn className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 gap-12">
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard">
            Get Started
            <LogIn className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-primary text-primary-foreground text-center p-6">
        <p className="mb-2">&copy; {currentYear ?? "..."} TaskTide. All rights reserved.</p>
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/privacy" className="hover:underline hover:opacity-80 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline hover:opacity-80 transition">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline hover:opacity-80 transition">
            Contact Us
          </Link>
        </div>
      </footer>
    </div>
  );
}
