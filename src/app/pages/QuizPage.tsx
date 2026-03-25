import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Lock, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { allChallengesData } from "./Challenges";
import { getCompletedLessons, isLessonCompleted } from "../utils/moduleProgress";
import { isFitnessCompletedToday } from "../utils/fitnessGate";

export function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { level, completedChallenges } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");

  const topics = ["All", "Cybersecurity", "Programming", "Networking", "Hardware"];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic") || "All";
    setActiveTopic(topics.includes(topic) ? topic : "All");
  }, [location.search]);

  useEffect(() => {
    if (getCompletedLessons().length === 0) {
      navigate("/app/challenges", { replace: true });
    }
  }, [navigate]);

  const processedQuizzes = useMemo(() => {
    return allChallengesData
      .map((challenge) => {
        const categoryChallenges = allChallengesData.filter((entry) => entry.category === challenge.category);
        const categoryIndex = categoryChallenges.findIndex((entry) => entry.id === challenge.id);
        const requiredLevel = categoryIndex + 1;
        const levelUnlocked = level >= requiredLevel;
        const lessonDone = isLessonCompleted(challenge.id);
        const completed = completedChallenges.includes(challenge.id);

        return {
          ...challenge,
          requiredLevel,
          levelUnlocked,
          lessonDone,
          completed,
          unlocked: levelUnlocked && lessonDone,
        };
      })
      .filter((entry) => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTopic = activeTopic === "All" || entry.category === activeTopic;
        return matchesSearch && matchesTopic;
      });
  }, [activeTopic, completedChallenges, level, searchQuery]);

  const handleTopicChange = (topic: string) => {
    setActiveTopic(topic);
    const next = topic === "All" ? "/app/quiz" : `/app/quiz?topic=${encodeURIComponent(topic)}`;
    navigate(next, { replace: true });
  };

  const handleStartQuiz = (quizId: string) => {
    const quizPath = `/app/quiz/${quizId}`;

    if (isFitnessCompletedToday(quizId)) {
      navigate(quizPath);
      return;
    }

    navigate(`/app/fitness?redirect=${encodeURIComponent(quizPath)}&module=${encodeURIComponent(quizId)}`);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-5 bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-widest text-slate-100 uppercase">Quizzes</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Complete module lesson to unlock quiz</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-2xl bg-slate-900 border border-slate-800 py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-400"
        />
      </div>

      <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
              activeTopic === topic
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/40"
                : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {processedQuizzes.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-sm text-slate-400">No quizzes found for this topic.</p>
          </div>
        ) : processedQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.3) }}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{quiz.title}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{quiz.category}</p>
                <p className="text-[11px] text-slate-400 mt-2">
                  {!quiz.levelUnlocked
                    ? `Unlocks at Level ${quiz.requiredLevel}`
                    : !quiz.lessonDone
                      ? "Complete module lesson first"
                      : "Ready to start"}
                </p>
              </div>
              <span className="text-[10px] font-black text-amber-400">+{quiz.xp} XP</span>
            </div>

            <div className="mt-3">
              {quiz.completed ? (
                <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} />
                  Completed
                </div>
              ) : quiz.unlocked ? (
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Start Quiz
                  <ArrowRight size={14} />
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <Lock size={13} />
                  Locked
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
