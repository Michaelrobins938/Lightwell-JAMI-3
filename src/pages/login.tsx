// pages/login.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth } from "../contexts/AuthContext";
import { NarratorOrbComponent } from "../components/visuals/NarratorOrb";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  LogIn,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  ShieldCheck,
  BadgeCheck,
  Verified,
  Accessibility,
  Brain,
  Users,
  TrendingUp,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Success modal
  const SuccessModal: React.FC<{ show: boolean; onClose: () => void }> = ({
    show,
    onClose,
  }) => {
    useEffect(() => {
      if (show) {
        const t = setTimeout(() => onClose(), 2500);
        return () => clearTimeout(t);
      }
    }, [show, onClose]);

    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 rounded-3xl shadow-2xl p-8 text-center w-full max-w-sm mx-4 border border-slate-600/40 backdrop-blur-xl relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 opacity-60 blur-sm" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/40"
            >
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign-in Successful!
            </h2>
            <p className="text-slate-300 mb-8">
              Welcome back to your mental wellness journey
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-4">Redirecting you...</p>
          </div>
        </motion.div>
      </div>
    );
  };

  // features
  const platformFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Therapy",
      description:
        "Access to Jamie, our advanced therapeutic AI with persistent memory and emotional intelligence",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Clinical-Grade Security",
      description:
        "HIPAA-compliant platform with enterprise-level privacy and data protection",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Community",
      description:
        "Connect with mental health professionals and peers in a supportive environment",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description:
        "Monitor your mental wellness journey with detailed analytics and insights",
    },
  ];

  const trustIndicators = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "HIPAA Compliant" },
    { icon: <BadgeCheck className="w-5 h-5" />, text: "SOC 2 Type II" },
    { icon: <Verified className="w-5 h-5" />, text: "FDA Ready" },
    { icon: <Accessibility className="w-5 h-5" />, text: "ADA Compliant" },
  ];

  const deviceCompatibility = [
    { icon: <Smartphone className="w-6 h-6" />, label: "Mobile" },
    { icon: <Tablet className="w-6 h-6" />, label: "Tablet" },
    { icon: <Laptop className="w-6 h-6" />, label: "Desktop" },
    { icon: <Monitor className="w-6 h-6" />, label: "Web" },
  ];

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError("Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push("/meet-jamie-3");
  };

  const handleMicrosoftSignIn = async () => {
    if (!mounted) return;

    setIsLoading(true);
    setError(null);

    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("azure-ad", {
        callbackUrl: "/meet-jamie-3",
        redirect: false,
      });

      if (result?.url) window.location.href = result.url;
      else setError("Microsoft sign-in failed.");
    } catch (err) {
      console.error(err);
      setError("Microsoft sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!mounted) return;

    setIsLoading(true);
    setError(null);

    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("google", {
        callbackUrl: "/meet-jamie-3",
        redirect: false,
      });

      if (result?.url) window.location.href = result.url;
      else setError("Google sign-in failed.");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Lightwell</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600" />
        <div className="fixed inset-0 bg-gradient-to-tr from-amber-400/20 via-transparent to-blue-400/20 animate-pulse" />
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-12 py-12">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 hidden lg:block"
            >
              <NarratorOrbComponent
                isVisible
                intensity={0.4}
                audioLevel={0.15}
                className="w-20 h-20 mx-auto"
              />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-zinc-200">
                Continue your mental wellness journey with{" "}
                <span className="bg-gradient-to-r from-amber-400 to-purple-500 bg-clip-text text-transparent font-semibold">
                  Jamie
                </span>
              </p>
              <div className="grid grid-cols-2 gap-6">
                {platformFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white/10 rounded-2xl backdrop-blur-lg border border-white/20"
                  >
                    {f.icon}
                    <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                    <p className="text-sm text-zinc-300">{f.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {trustIndicators.map((ti, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm text-white/80"
                  >
                    {ti.icon} {ti.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                {deviceCompatibility.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm text-white/80"
                  >
                    {d.icon} {d.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Login */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md bg-zinc-900/70 p-8 rounded-3xl backdrop-blur-xl border border-white/10"
            >
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white">
                  Sign In to Your Account
                </h2>
                <p className="text-zinc-400 text-sm">
                  Secure login to your mental wellness journey
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 text-red-300 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                onClick={handleMicrosoftSignIn}
                className="w-full py-3 bg-white/10 text-white rounded-xl mb-6 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M12 1h10v10H12z" />
                  <path fill="#7FBA00" d="M1 12h10v10H1z" />
                  <path fill="#FFB900" d="M12 12h10v10H12z" />
                </svg>
                Continue with Microsoft
              </button>

              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 bg-white/10 text-white rounded-xl mb-6 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.75c-.99.67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                <span className="mx-6 text-slate-500 text-sm font-medium">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-white text-sm">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-xl bg-white text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-xl text-white font-bold"
                >
                  {isLoading ? "Signing in..." : "Sign In Securely"}
                </button>
              </form>

              <p className="text-center text-zinc-400 text-sm mt-4">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-amber-400">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Success modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <SuccessModal
              show={showSuccessModal}
              onClose={handleSuccessModalClose}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
