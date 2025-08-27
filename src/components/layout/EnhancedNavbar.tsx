"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "AI Therapy", href: "/chat" },
  { name: "Community", href: "/community" },
  { name: "Experience AI", href: "/meet-jamie" },
  { name: "Showcase", href: "/showcase" },
  { name: "About", href: "/about" },
  { name: "Resources", href: "/resources" },
  { name: "Get Help", href: "/support" },
];

export default function EnhancedNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md shadow-lg border-b border-slate-800/50"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            Luna
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <motion.div 
          className="hidden md:flex gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href || 
              (link.href !== "/" && pathname.startsWith(link.href));
            
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.3 + (index * 0.05),
                  ease: "easeOut" 
                }}
              >
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                      : "text-slate-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400"
                  }`}
                >
                  {link.name}
                  
                  {/* Active underline with smooth animation */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover underline */}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-purple-400/60 to-blue-400/60 rounded-full transition-all duration-250 group-hover:w-full" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Auth Buttons (Desktop) */}
        <motion.div 
          className="hidden md:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Sign Up
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={24} />
        </motion.button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl border-r border-slate-800/50 z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">L</span>
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Luna
                  </span>
                </div>
                <button
                  className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Links */}
              <motion.div
                className="flex-1 p-6"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { 
                      staggerChildren: 0.08,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || 
                      (link.href !== "/" && pathname.startsWith(link.href));
                    
                    return (
                      <motion.div
                        key={link.name}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          show: { opacity: 1, x: 0 }
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                            isActive
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 bg-slate-800/50"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Auth Buttons */}
                <motion.div 
                  className="mt-8 pt-6 border-t border-slate-800/50 space-y-3"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full px-4 py-3 text-center text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full px-4 py-3 text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}