"use client";
import { ParallaxSection } from "../../hooks/useParallax";
import { motion } from "framer-motion";
import { scaleIn, fadeUp, orbBreathing } from "../../utils/animations";

export default function Consciousness() {
  return (
    <section id="consciousness" className="h-screen snap-start relative flex flex-col items-center justify-center overflow-hidden">
      <motion.h2 
        initial="hidden" 
        whileInView="visible" 
        variants={fadeUp} 
        className="text-4xl font-bold mb-12 z-10 text-center"
      >
        Jamie's Consciousness
      </motion.h2>

      <ParallaxSection speed={-0.25}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scaleIn}
          className="w-80 h-80 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-60"
          animate="animate"
        />
      </ParallaxSection>

      <ParallaxSection speed={-0.4}>
        <div className="absolute w-[40rem] h-[40rem] bg-blue-500/10 blur-3xl rounded-full" />
      </ParallaxSection>

      {/* Floating labels around the orb */}
      <div className="relative z-10">
        {[
          { text: "Persistent Memory", angle: 0, delay: 0 },
          { text: "Emotional Intelligence", angle: 60, delay: 0.2 },
          { text: "Clinical Reasoning", angle: 120, delay: 0.4 },
          { text: "Adaptive Learning", angle: 180, delay: 0.6 },
          { text: "Crisis Detection", angle: 240, delay: 0.8 },
          { text: "Empathetic Response", angle: 300, delay: 1.0 }
        ].map((label, index) => (
          <motion.div
            key={index}
            className="absolute text-sm text-gray-300 font-medium"
            style={{
              left: `calc(50% + ${Math.cos(label.angle * Math.PI / 180) * 200}px)`,
              top: `calc(50% + ${Math.sin(label.angle * Math.PI / 180) * 200}px)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: label.delay, duration: 0.6 }}
          >
            {label.text}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
