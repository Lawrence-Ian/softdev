import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Trophy, LockOpen, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export const allChallengesData = [
  // Cybersecurity (9)
  { id: "c1", title: "Phishing Simulation", category: "Cybersecurity", xp: 100, color: "violet" },
  { id: "c2", title: "Fix the Firewall", category: "Cybersecurity", xp: 150, color: "violet" },
  { id: "c3", title: "SQL Injection Defense", category: "Cybersecurity", xp: 200, color: "violet" },
  { id: "c4", title: "Malware Analysis Basics", category: "Cybersecurity", xp: 300, color: "violet" },
  { id: "c5", title: "Network Sniffing", category: "Cybersecurity", xp: 400, color: "violet" },
  { id: "c6", title: "Zero Trust Architecture", category: "Cybersecurity", xp: 500, color: "violet" },
  { id: "c7", title: "SIEM Alert Triage", category: "Cybersecurity", xp: 600, color: "violet" },
  { id: "c8", title: "Incident Response Playbook", category: "Cybersecurity", xp: 700, color: "violet" },
  { id: "c9", title: "Cloud IAM Hardening", category: "Cybersecurity", xp: 800, color: "violet" },

  // Programming (9)
  { id: "p1", title: "Variables & Types", category: "Programming", xp: 100, color: "fuchsia" },
  { id: "p2", title: "Array Sorting", category: "Programming", xp: 150, color: "fuchsia" },
  { id: "p3", title: "Recursive Functions", category: "Programming", xp: 200, color: "fuchsia" },
  { id: "p4", title: "API Integration", category: "Programming", xp: 300, color: "fuchsia" },
  { id: "p5", title: "Asynchronous Logic", category: "Programming", xp: 400, color: "fuchsia" },
  { id: "p6", title: "Design Patterns", category: "Programming", xp: 500, color: "fuchsia" },
  { id: "p7", title: "State Management", category: "Programming", xp: 600, color: "fuchsia" },
  { id: "p8", title: "TypeScript Safety", category: "Programming", xp: 700, color: "fuchsia" },
  { id: "p9", title: "Performance Optimization", category: "Programming", xp: 800, color: "fuchsia" },

  // Networking (8)
  { id: "n1", title: "OSI Model Quiz", category: "Networking", xp: 100, color: "cyan" },
  { id: "n2", title: "Subnet Puzzle", category: "Networking", xp: 150, color: "cyan" },
  { id: "n3", title: "TCP vs UDP Traffic", category: "Networking", xp: 200, color: "cyan" },
  { id: "n4", title: "Configure the Router", category: "Networking", xp: 300, color: "cyan" },
  { id: "n5", title: "BGP Troubleshooting", category: "Networking", xp: 400, color: "cyan" },
  { id: "n6", title: "VLAN Segmentation", category: "Networking", xp: 500, color: "cyan" },
  { id: "n7", title: "VPN Site-to-Site", category: "Networking", xp: 600, color: "cyan" },
  { id: "n8", title: "Load Balancer Tuning", category: "Networking", xp: 700, color: "cyan" },

  // Hardware (7)
  { id: "h1", title: "Identify Components", category: "Hardware", xp: 100, color: "emerald" },
  { id: "h2", title: "Build a PC", category: "Hardware", xp: 150, color: "emerald" },
  { id: "h3", title: "RAM Overclocking", category: "Hardware", xp: 200, color: "emerald" },
  { id: "h4", title: "Thermal Paste Application", category: "Hardware", xp: 300, color: "emerald" },
  { id: "h5", title: "Power Supply Diagnostics", category: "Hardware", xp: 400, color: "emerald" },
  { id: "h6", title: "Storage RAID Planning", category: "Hardware", xp: 500, color: "emerald" },
  { id: "h7", title: "BIOS Optimization", category: "Hardware", xp: 600, color: "emerald" },
];

export function Challenges() {
  const navigate = useNavigate();
  const { level, completedChallenges } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleOpenModule = (challengeId: string) => {
    navigate(`/app/challenges/${challengeId}`);
  };

  const categories = ["All", "Cybersecurity", "Programming", "Networking", "Hardware"];
  
// Calculate unlocked challenges per category based on level
  // Each category unlocks 1 challenge per level
  // Category order: Cybersecurity (c1-c6), Programming (p1-p6), Networking (n1-n5), Hardware (h1-h4)
  const getUnlockedCountForCategory = (category: string) => {
    const maxLevel = 30;
    // First challenge in each category is unlocked at level 1
    // Subsequent challenges unlock as user levels up
    return Math.min(level, maxLevel);
  };

  // Process challenges with lock states - per category progression
  const processedChallenges = useMemo(() => {
    return allChallengesData.map((challenge) => {
      // Get the position of this challenge within its category
      const categoryChallenges = allChallengesData.filter(c => c.category === challenge.category);
      const categoryIndex = categoryChallenges.findIndex(c => c.id === challenge.id);
      
      // Unlock level: level 1 = first challenge, level 2 = second challenge, etc.
      const requiredLevel = categoryIndex + 1;
      const isLocked = level < requiredLevel;
      const isCompleted = completedChallenges.includes(challenge.id);
      
      return { ...challenge, isLocked, isCompleted, requiredLevel };
    });
  }, [level, completedChallenges]);

  // Filter challenges based on category and search
  const filteredChallenges = useMemo(() => {
    return processedChallenges.filter(c => {
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [processedChallenges, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-6 bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest text-slate-100 uppercase">MODULES</h1>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Level Up to Unlock More Challenges</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Trophy size={24} className="text-amber-400" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search challenges..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
                activeCategory === cat 
                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" 
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge List */}
      <div className="flex flex-col gap-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm font-medium">
            No challenges found.
          </div>
        ) : (
          filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className={`w-full rounded-[1.5rem] border p-4 flex items-center gap-4 transition-all relative overflow-hidden ${
                challenge.isLocked 
                  ? "bg-slate-900/50 border-slate-800/50 opacity-60 grayscale-[0.5]" 
                  : challenge.isCompleted
                    ? "bg-slate-900 border-slate-800"
                    : `bg-gradient-to-r from-${challenge.color}-500/10 to-transparent border-${challenge.color}-500/30`
              }`}
            >
              <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner ${
                challenge.isLocked ? "bg-slate-950 border-slate-800 text-slate-600" :
                challenge.isCompleted ? "bg-slate-950 border-slate-800 text-emerald-500" :
                `bg-${challenge.color}-950 border-${challenge.color}-800/50 text-${challenge.color}-400`
              }`}>
                {challenge.isCompleted ? <CheckCircle2 size={24} /> : 
                 challenge.isLocked ? <LockOpen size={24} /> : 
                 <Play size={24} className="ml-1" />}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-200 truncate">{challenge.title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{challenge.category}</p>
                {challenge.isLocked && (
                  <p className="text-[9px] text-amber-500/80 mt-1 font-bold">
                    Unlock at Level {challenge.requiredLevel}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                  challenge.isLocked ? "text-slate-600 bg-slate-950" : "text-amber-400 bg-amber-950/30"
                }`}>
                  +{challenge.xp} XP
                </span>
                
                {!challenge.isLocked && !challenge.isCompleted && (
                  <button 
                    onClick={() => handleOpenModule(challenge.id)}
                    className={`w-8 h-8 rounded-full bg-${challenge.color}-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

