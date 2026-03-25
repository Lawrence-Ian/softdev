import { motion } from "motion/react";
import { ProfileHeader } from "../components/ProfileHeader";
import { ActivitySection } from "../components/ActivitySection";

export function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-6 md:pt-8 pb-12 md:pb-16 gap-6 bg-slate-950">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase">
            SkillUp
          </h1>
          <div className="flex gap-2">
            <div className="bg-slate-800/80 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)] border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-100 tracking-wider">ONLINE</span>
            </div>
          </div>
        </div>

        <ProfileHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ActivitySection />
      </motion.div>

    </div>
  );
}
