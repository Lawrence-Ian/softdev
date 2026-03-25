import { motion } from "motion/react";
import { BookOpen, Star, Code2, Network, Shield, Cpu, Play, CheckCircle2, Activity, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { allChallengesData } from "./Challenges";

export function Skills() {
  const navigate = useNavigate();
  const { xp, level, completedChallenges } = useAppContext();

  const calculateSkill = (divider: number) => Math.min(Math.floor(xp / divider), 100);

  const skills = [
    { name: "Programming", level: calculateSkill(20), color: "fuchsia", icon: <Code2 size={24} /> },
    { name: "Networking", level: calculateSkill(25), color: "cyan", icon: <Network size={24} /> },
    { name: "Cybersecurity", level: calculateSkill(15), color: "violet", icon: <Shield size={24} /> },
    { name: "Hardware", level: calculateSkill(30), color: "emerald", icon: <Cpu size={24} /> },
    { name: "Fitness", level: calculateSkill(40), color: "orange", icon: <Activity size={24} /> },
  ];

  // Process modules with lock states - per category progression
  // Level 1 = first challenge in each category, Level 2 = second challenge, etc.
  const modules = allChallengesData.map((challenge) => {
    const categoryChallenges = allChallengesData.filter(c => c.category === challenge.category);
    const categoryIndex = categoryChallenges.findIndex(c => c.id === challenge.id);
    
    // Unlock level: level 1 = first challenge, level 2 = second challenge, etc.
    const requiredLevel = categoryIndex + 1;
    const isLocked = level < requiredLevel;
    const isCompleted = completedChallenges.includes(challenge.id);
    
    return { 
      ...challenge, 
      isLocked, 
      isCompleted, 
      requiredLevel 
    };
  });

  // Group modules by category for display
  const categories = ["Cybersecurity", "Programming", "Networking", "Hardware"];
  
  const getCategoryModules = (category: string) => {
    return modules.filter(m => m.category === category);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-6 bg-slate-950 text-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase">Skills</h1>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Your Craft</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
          <BookOpen size={24} className="text-indigo-400" />
        </div>
      </div>

      {/* Skill Progress Cards */}
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center gap-3 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-${skill.color}-500/50`} />
            <div className={`text-${skill.color}-400 mb-2`}>{skill.icon}</div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-center">{skill.name}</h3>
            <div className="flex flex-col items-center gap-1 w-full">
              <span className="text-2xl font-black text-slate-100">{skill.level}%</span>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full bg-${skill.color}-500 rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modules Section - Grouped by Category */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest pl-2 border-l-2 border-indigo-500 flex items-center gap-2">
          <Star size={16} className="text-indigo-400" />
          All Modules
        </h2>

        {/* Category Progress */}
        <div className="flex flex-col gap-4">
          {categories.map((category) => {
            const categoryModules = getCategoryModules(category);
            const categoryColor = categoryModules[0]?.color || "slate";
            
            // Count unlocked, completed, and locked
            const unlockedCount = categoryModules.filter(m => !m.isLocked).length;
            const completedCount = categoryModules.filter(m => m.isCompleted).length;
            
            return (
              <div key={category} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{category}</h3>
                  <span className="text-[10px] font-medium text-slate-500">
                    {completedCount}/{unlockedCount} completed
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  {categoryModules.map((mod) => (
                    <div 
                      key={mod.id}
                      onClick={() => !mod.isLocked && navigate(`/app/challenges/${mod.id}`)}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        mod.isLocked 
                          ? "bg-slate-900/50 border-slate-800/50 opacity-60 grayscale-[0.5]" 
                          : mod.isCompleted
                            ? "bg-slate-900 border-slate-800 hover:bg-slate-800"
                            : `bg-gradient-to-r from-${mod.color}-500/10 to-transparent border-${mod.color}-500/30 hover:bg-slate-800`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          mod.isLocked ? "bg-slate-950 border border-slate-800 text-slate-600" :
                          mod.isCompleted ? "bg-slate-950 border border-slate-800 text-emerald-500" :
                          `bg-${mod.color}-950/50 border border-${mod.color}-800/50 text-${mod.color}-400`
                        }`}>
                          {mod.isCompleted ? <CheckCircle2 size={16} /> : 
                           mod.isLocked ? <Lock size={16} /> : 
                           <Play size={16} className="ml-0.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{mod.title}</h4>
                          {mod.isLocked && (
                            <p className="text-[9px] text-amber-500/80 font-medium">
                              Lvl {mod.requiredLevel}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`text-[9px] font-black px-2 py-1 rounded ${
                        mod.isLocked ? "text-slate-600 bg-slate-950" : "text-amber-400 bg-amber-950/30"
                      }`}>
                        +{mod.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

