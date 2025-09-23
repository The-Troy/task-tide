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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="w-full max-w-3xl"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Card className="shadow-2xl text-center transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl">
              <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
                  <BookMarked className="h-10 w-10" />
                </div>
                <CardTitle className="text-4xl font-headline text-primary">
                  Welcome to TaskTide
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                  Your all-in-one platform for academic document management and group
                  collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <Image
                  src="/images/hero-image.jpg"
                  alt="TaskTide illustration"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-md"
                />
                <p className="text-center text-foreground max-w-xl">
                  TaskTide helps students and class representatives streamline their
                  academic workflow. Access documents by semester and unit, view PDFs
                  in-app, manage assignment groups, and stay updated with
                  notifications.
                </p>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/dashboard">
                    Get Started
                    <LogIn className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Animated Counters */}
          <div
            ref={counterRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-8"
          >
            {Object.entries(counters).map(([key, value]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-4xl font-bold text-primary">{value}+</p>
                <p className="text-muted-foreground capitalize">{key}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mt-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer"
              onClick={() => alert(`You clicked: ${feature.title}`)}
            >
              <Card className="shadow-lg p-6 text-center transition-all duration-300 hover:bg-primary/10">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl w-full text-center mt-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-primary">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="cursor-pointer"
              >
                <Card className="shadow-md p-6 hover:shadow-xl transition-all">
                  <p className="italic mb-4">“{t.quote}”</p>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="max-w-2xl w-full text-center mt-16 p-8 bg-card rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Mail className="h-6 w-6 text-primary" /> Stay Updated
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our newsletter to get updates on new features, tips, and upcoming releases.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded-xl p-3 w-full sm:w-2/3 focus:outline-none"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Subscribe
            <p className="text-center text-foreground">
              TaskTide helps students and class representatives streamline their academic workflow. 
              Access documents by semester and unit, view PDFs in-app, manage assignment groups, 
              and stay updated with notifications.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/login">
                Get Started
                <LogIn className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </form>
        </motion.section>
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
