import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ShieldAlert, Code2, Puzzle, Play, Cpu, BookOpen, CheckCircle2 } from "lucide-react";
import { allChallengesData } from "./Challenges";
import { isLessonCompleted, markLessonCompleted } from "../utils/moduleProgress";
import { playCompletionSound } from "../utils/audio";

const lessonsData: Record<string, { title: string; content: string[] }> = {
  Cybersecurity: {
    title: "Cybersecurity Fundamentals",
    content: [
      "Cybersecurity protects computer systems, networks, and data from digital attacks.",
      "Common threats include phishing, malware, ransomware, and unauthorized access.",
      "Best practices: Use strong passwords, enable MFA, keep software updated, and avoid suspicious links.",
      "Firewalls act as a barrier between trusted internal networks and untrusted external networks.",
    ],
  },
  Programming: {
    title: "Programming Essentials",
    content: [
      "Variables store data values; types include strings, numbers, booleans, and arrays.",
      "Arrays store multiple values in a single variable, accessible by index.",
      "Functions are reusable blocks of code that perform specific tasks.",
      "Asynchronous programming allows multiple operations to run without waiting.",
    ],
  },
  Networking: {
    title: "Networking Basics",
    content: [
      "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
      "TCP ensures reliable delivery; UDP is faster but less reliable.",
      "Port 443 is used for HTTPS (secure web traffic); Port 80 is for HTTP.",
      "Routers connect different networks; switches connect devices within the same network.",
    ],
  },
  Hardware: {
    title: "Computer Hardware",
    content: [
      "The CPU executes instructions and drives general system performance.",
      "RAM gives fast temporary memory for currently running processes.",
      "The motherboard connects all components for communication.",
      "Thermal management helps maintain stable performance and hardware life.",
    ],
  },
};

export function ChallengeModule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stage, setStage] = useState<"loading" | "lesson">("loading");
  const [completed, setCompleted] = useState(id ? isLessonCompleted(id) : false);

  const challenge = allChallengesData.find((entry) => entry.id === id);
  const moduleData = challenge || { id: "unknown", title: "Unknown Module", category: "General", xp: 0 };
  const currentLesson = lessonsData[moduleData.category] || lessonsData.Programming;

  const getIcon = (category: string) => {
    switch (category) {
      case "Cybersecurity":
        return <ShieldAlert size={48} className="text-violet-400" />;
      case "Programming":
        return <Code2 size={48} className="text-fuchsia-400" />;
      case "Networking":
        return <Puzzle size={48} className="text-cyan-400" />;
      case "Hardware":
        return <Cpu size={48} className="text-emerald-400" />;
      default:
        return <Play size={48} className="text-slate-400" />;
    }
  };

  useEffect(() => {
    if (stage !== "loading") {
      return;
    }

    const timer = setTimeout(() => setStage("lesson"), 1000);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (!id) {
      return;
    }
    setCompleted(isLessonCompleted(id));
  }, [id]);

  const handleMarkAsLearned = () => {
    if (!id) {
      return;
    }

    markLessonCompleted(id);
    setCompleted(true);
    playCompletionSound();
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-16 gap-6 bg-slate-950">
      <div className="flex items-center gap-4 mb-2 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-widest text-slate-100 uppercase truncate pr-4">{moduleData.title}</h1>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{moduleData.category} Module</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col p-6 bg-slate-900/60 rounded-3xl border border-slate-800"
      >
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 text-center"
            >
              <div className="mb-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">{getIcon(moduleData.category)}</div>
              <h2 className="text-xl font-bold text-white">Loading lesson...</h2>
            </motion.div>
          )}

          {stage === "lesson" && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Lesson</span>
              </div>

              <h2 className="text-lg font-bold text-white mb-4">{currentLesson.title}</h2>

              <div className="flex-1 flex flex-col gap-3 mb-6 overflow-y-auto pr-1">
                {currentLesson.content.map((point, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-xl bg-slate-950 border border-slate-700">
                    <span className="text-indigo-400 font-bold text-xs shrink-0">{idx + 1}.</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleMarkAsLearned}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${
                    completed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  {completed ? "Lesson Completed" : "Mark Lesson as Completed"}
                </button>

                <button
                  onClick={() => navigate(`/app/quiz?topic=${encodeURIComponent(moduleData.category)}`)}
                  disabled={!completed}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${
                    completed
                      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      : "bg-slate-900 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  Go to Quizzes
                </button>

                {completed && (
                  <p className="text-[11px] text-emerald-300 font-semibold text-center flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} />
                    Quiz is now available in the Quizzes page.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
