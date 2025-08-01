import { Icons } from "@/components/icons";
import {
  BrainIcon,
  CodeIcon,
  GlobeIcon,
  PlugIcon,
  UsersIcon,
  ZapIcon,
  SwordIcon,
  ShieldIcon,
  CrownIcon,
  StarIcon,
  HeartIcon,
  TargetIcon,
} from "lucide-react";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "LitRPG Unlimited",
  description: "Immerse yourself in the ultimate LitRPG experience with unlimited adventures, character progression, and epic quests.",
  cta: "Start Adventure",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "LitRPG",
    "Gaming",
    "RPG",
    "Character Progression",
    "Quests",
    "Adventures",
    "Gaming Community",
    "Virtual Worlds",
  ],
  links: {
    email: "support@litrpgunlimited.com",
    twitter: "https://twitter.com/litrpgunlimited",
    discord: "https://discord.gg/litrpgunlimited",
    github: "https://github.com/litrpgunlimited",
    instagram: "https://instagram.com/litrpgunlimited",
  },
  hero: {
    title: "LitRPG Unlimited",
    description:
      "Embark on epic adventures in a world where your real-life skills translate into game power. Level up, complete quests, and become the ultimate hero in this immersive LitRPG experience.",
    cta: "Start Your Journey",
    ctaDescription: "Join thousands of players worldwide",
  },
  features: [
    {
      name: "Character Progression",
      description:
        "Level up your character with real skills and watch your abilities grow in both game and reality.",
      icon: <SwordIcon className="h-6 w-6" />,
    },
    {
      name: "Epic Quests",
      description:
        "Embark on challenging quests that test your skills and reward you with unique achievements.",
      icon: <TargetIcon className="h-6 w-6" />,
    },
    {
      name: "Guild System",
      description:
        "Join powerful guilds and collaborate with other players to conquer the most challenging dungeons.",
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      name: "Achievement System",
      description:
        "Unlock rare achievements and earn prestigious titles as you master different aspects of the game.",
      icon: <CrownIcon className="h-6 w-6" />,
    },
    {
      name: "Real-time Combat",
      description:
        "Experience thrilling real-time combat with advanced AI opponents and dynamic battle mechanics.",
      icon: <ShieldIcon className="h-6 w-6" />,
    },
    {
      name: "Cross-Platform",
      description:
        "Play seamlessly across all devices with cloud saves and synchronized progression.",
      icon: <GlobeIcon className="h-6 w-6" />,
    },
  ],
  pricing: [
    {
      name: "Adventurer",
      price: { monthly: "$9", yearly: "$99" },
      frequency: { monthly: "month", yearly: "year" },
      description: "Perfect for new players starting their journey.",
      features: [
        "Access to basic quests and dungeons",
        "Character progression system",
        "Community forum access",
        "Email support",
        "Basic achievement tracking",
      ],
      cta: "Start Adventure",
    },
    {
      name: "Hero",
      price: { monthly: "$29", yearly: "$290" },
      frequency: { monthly: "month", yearly: "year" },
      description: "For dedicated players seeking epic challenges.",
      features: [
        "All Adventurer features",
        "Advanced quest system",
        "Guild creation and management",
        "Priority support",
        "Exclusive dungeons",
        "Advanced analytics",
        "Custom character skins",
      ],
      cta: "Become Hero",
    },
    {
      name: "Legend",
      price: { monthly: "$99", yearly: "$999" },
      frequency: { monthly: "month", yearly: "year" },
      description: "Ultimate experience for serious gamers and content creators.",
      features: [
        "All Hero features",
        "Unlimited quest access",
        "Exclusive legendary items",
        "24/7 priority support",
        "Custom guild features",
        "Advanced analytics dashboard",
        "Early access to new content",
        "Personal game master support",
      ],
      popular: true,
      cta: "Become Legend",
    },
  ],
  footer: {
    socialLinks: [
      {
        icon: <Icons.github className="h-5 w-5" />,
        url: "#",
      },
      {
        icon: <Icons.twitter className="h-5 w-5" />,
        url: "#",
      },
      {
        icon: <Icons.discord className="h-5 w-5" />,
        url: "#",
      },
    ],
    links: [
      { text: "Pricing", url: "#" },
      { text: "Contact", url: "#" },
      { text: "Support", url: "#" },
      { text: "Community", url: "#" },
    ],
    bottomText: "All rights reserved.",
    brandText: "LITRPG UNLIMITED",
  },

  testimonials: [
    {
      id: 1,
      text: "LitRPG Unlimited has completely changed how I approach gaming. The real skill progression system is absolutely brilliant!",
      name: "Alex Chen",
      company: "Gaming Enthusiast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      text: "The quest system is incredibly engaging. I've never felt so motivated to improve my real-life skills while gaming!",
      name: "Sarah Johnson",
      company: "Fitness Coach",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 3,
      text: "The guild system is amazing! I've made friends from around the world and we tackle epic challenges together.",
      name: "Mike Rodriguez",
      company: "Software Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 4,
      text: "The achievement system keeps me motivated. I love unlocking rare titles and showing off my progress!",
      name: "Emma Wilson",
      company: "Student",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 5,
      text: "The real-time combat is incredibly smooth and responsive. It feels like I'm actually in the game!",
      name: "David Kim",
      company: "Esports Player",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 6,
      text: "Cross-platform play is a game-changer. I can continue my adventure on any device seamlessly.",
      name: "Lisa Thompson",
      company: "Marketing Manager",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 7,
      text: "The character progression system is genius. I've actually improved my real-life skills while playing!",
      name: "James Anderson",
      company: "Personal Trainer",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 8,
      text: "The community is incredible. I've learned so much from other players and made lasting friendships.",
      name: "Rachel Green",
      company: "Community Manager",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 9,
      text: "The quest system is perfectly balanced. Challenging but never frustrating, always rewarding!",
      name: "Tom Martinez",
      company: "Game Designer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 10,
      text: "The achievement system is addictive in the best way. I love collecting rare titles and showing them off!",
      name: "Nina Patel",
      company: "Data Analyst",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 11,
      text: "The real-time combat mechanics are incredibly satisfying. Every battle feels epic and meaningful!",
      name: "Carlos Rodriguez",
      company: "Fighting Game Enthusiast",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 12,
      text: "The guild system has created such a strong community. We've accomplished things I never thought possible!",
      name: "Amanda Foster",
      company: "Team Leader",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzZ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 13,
      text: "The character customization is incredible. I can create exactly the hero I want to be!",
      name: "Marcus Johnson",
      company: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 14,
      text: "The progression system is perfectly designed. I always feel like I'm making meaningful progress!",
      name: "Sophie Chen",
      company: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
    {
      id: 15,
      text: "Cross-platform play is seamless. I can switch between devices without losing any progress!",
      name: "Ryan Thompson",
      company: "Mobile Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHBvcnRyYWl0fGVufDB8fDB8fHww",
    },
  ],
};

export type SiteConfig = typeof siteConfig; 