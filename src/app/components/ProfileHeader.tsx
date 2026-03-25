import { motion } from "motion/react";
import { Zap, Hexagon, Trophy, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";

export function ProfileHeader() {
  const { xp, level, profilePic, username } = useAppContext();

  const xpForNextLevel = level * 1000;
  const currentLevelXp = xp % 1000;
  const xpPercent = Math.min(
    (currentLevelXp / xpForNextLevel) * 100,
    100,
  );

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/20 p-4 md:p-6 shadow-[0_10px_40px_-15px_rgba(99,102,241,0.5)] backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl">
        <Hexagon size={120} strokeWidth={1} />
      </div>

      <div className="relative flex items-center gap-3 md:gap-5">
        {/* Avatar with Level Badge */}
        <div className="relative shrink-0">
          <div className="w-16 md:w-20 h-16 md:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Player Avatar"
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                />
              ) : (
                <User size={24} className="md:w-8 md:h-8 text-slate-500" />
              )}
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 bg-slate-950 border-2 border-cyan-400 text-cyan-400 rounded-lg px-1.5 md:px-2 py-0.5 shadow-[0_0_15px_rgba(34,211,238,0.6)]">
            <span className="text-[8px] md:text-[10px] font-black tracking-wider block leading-none">
              LVL
            </span>
            <span className="text-xs md:text-sm font-black leading-none block text-center">
              {level}
            </span>
          </div>
        </div>

        {/* Player Info & XP */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-white truncate mb-1 flex items-center gap-2">
            {username}
            <Trophy size={12} className="md:w-4 md:h-4 text-amber-400" />
          </h2>
          <p className="text-xs text-indigo-300 font-medium tracking-wide mb-3">
            Rank:{" "}
            {level > 10
              ? "Senior"
              : level > 5
                ? "Junior"
                : "Trainee"}
          </p>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>XP to Level {level + 1}</span>
              <span className="text-cyan-400">
                {currentLevelXp} / {xpForNextLevel}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: 0.5,
                }}
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 relative"
              >
                <div
                  className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}