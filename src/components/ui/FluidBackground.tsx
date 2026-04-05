"use client";

import { motion } from "framer-motion";

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Dynamic Blobs */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-neon-blue/20 blur-[120px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-neon-purple/20 blur-[120px]"
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 1.1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[100px]"
        animate={{
          x: [0, 50, -100, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }}
      />
    </div>
  );
}
