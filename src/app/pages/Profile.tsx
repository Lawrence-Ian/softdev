import { motion } from "motion/react";
import { User, Settings, Award, Shield, Cpu, Code2, Network } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export function Profile() {
  const navigate = useNavigate();
  const { xp, level, profilePic, username } = useAppContext();

  const calculateSkill = (divider: number) => Math.min(Math.floor(xp / divider), 100);

  const getRank = () => {
    if (level >= 15) return "Master";
    if (level >= 10) return "Expert";
    if (level >= 5) return "Novice";
    return "Trainee";
  };

  const getRankColor = () => {
    if (level >= 15) return "text-indigo-400";
    if (level >= 10) return "text-amber-400";
    if (level >= 5) return "text-cyan-400";
    return "text-slate-400";
  };

  const stats = [
    { label: "Level", value: level.toString(), icon: <Award size={16} className="text-amber-400" /> },
    { label: "Total XP", value: xp.toLocaleString(), icon: <User size={16} className="text-cyan-400" /> },
    { label: "Streak", value: xp > 0 ? "1 Day" : "0 Days", icon: <Award size={16} className="text-orange-400" /> },
    { label: "Rank", value: getRank(), icon: <Shield size={16} className={getRankColor()} /> },
  ];

  const skills = [
    { name: "Programming", level: calculateSkill(20), color: "fuchsia", icon: <Code2 size={24} /> },
    { name: "Networking", level: calculateSkill(25), color: "cyan", icon: <Network size={24} /> },
    { name: "Cybersecurity", level: calculateSkill(15), color: "violet", icon: <Shield size={24} /> },
    { name: "Hardware", level: calculateSkill(30), color: "emerald", icon: <Cpu size={24} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-6 bg-slate-950 text-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-widest uppercase">Profile</h1>
        <button 
          onClick={() => navigate("/app/settings")}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          <Settings size={24} className="text-slate-400" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-950 overflow-hidden">
              {profilePic ? (
                <img src={profilePic} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-500" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black text-xs px-2 py-1 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            Lvl {level}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{username}</h2>
          <p className={`text-xs font-medium uppercase tracking-widest ${getRankColor()}`}>{getRank()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2">
              {stat.icon}
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <span className="text-lg font-black tracking-tighter">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Skill Mastery</h3>
        <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className={`text-${skill.color}-400`}>{skill.icon}</div>
                  {skill.name}
                </div>
                <span className="text-xs font-black text-slate-400">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                  className={`h-full bg-${skill.color}-500 rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

