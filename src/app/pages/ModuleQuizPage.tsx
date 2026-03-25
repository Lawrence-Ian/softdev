import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { allChallengesData } from "./Challenges";
import { moduleQuestions } from "../data/moduleQuestions";
import { useAppContext } from "../context/AppContext";
import { isLessonCompleted } from "../utils/moduleProgress";
import { isFitnessCompletedToday, resetFitnessGate } from "../utils/fitnessGate";
import { playApplauseSound } from "../utils/audio";

const QUESTION_TIME_LIMIT_SECONDS = 10;

export function ModuleQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { level, markChallengeCompleted } = useAppContext();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [wrongReason, setWrongReason] = useState<"answer" | "timeout" | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT_SECONDS);
  const [timeoutCount, setTimeoutCount] = useState(0);
  const MAX_TIMEOUTS = 1;

  const challenge = allChallengesData.find((entry) => entry.id === id);
  const questions = id ? moduleQuestions[id] || [] : [];
  const currentQuestion = questions[questionIndex];

  const requiredLevel = useMemo(() => {
    if (!challenge) {
      return Number.MAX_SAFE_INTEGER;
    }
    const categoryChallenges = allChallengesData.filter((entry) => entry.category === challenge.category);
    const categoryIndex = categoryChallenges.findIndex((entry) => entry.id === challenge.id);
    return categoryIndex + 1;
  }, [challenge]);

  useEffect(() => {
    if (!id || !challenge || questions.length === 0) {
      navigate("/app/quiz", { replace: true });
      return;
    }

    if (level < requiredLevel || !isLessonCompleted(id)) {
      navigate("/app/quiz", { replace: true });
      return;
    }

    if (!isFitnessCompletedToday(id)) {
      const redirect = encodeURIComponent(`/app/quiz/${id}`);
      navigate(`/app/fitness?redirect=${redirect}&module=${encodeURIComponent(id)}`, { replace: true });
    }
  }, [challenge, id, level, navigate, questions.length, requiredLevel]);

  useEffect(() => {
    if (isCompleted) {
      return;
    }

    setTimeLeft(QUESTION_TIME_LIMIT_SECONDS);
    setTimeoutCount(0);
  }, [questionIndex, isCompleted]);

  useEffect(() => {
    if (isCompleted || isWrong) {
      return;
    }

    if (timeLeft <= 0) {
      setIsWrong(true);
      setWrongReason("timeout");
      setTimeoutCount((prev) => {
        console.log(`Quiz timeout #${prev + 1}/${MAX_TIMEOUTS}`);
        return 1; // Reset to 1 for immediate trigger on next timeout
      });
      const timeout = setTimeout(() => {
        setIsWrong(false);
        setWrongReason(null);
        setSelectedAnswer(null);
        setTimeLeft(QUESTION_TIME_LIMIT_SECONDS);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, isWrong, timeLeft]);

  useEffect(() => {
    if (timeoutCount >= MAX_TIMEOUTS && id) {
      console.log(`Max timeouts reached (${timeoutCount}/${MAX_TIMEOUTS} for ${id}), resetting fitness & navigating to module`);
      resetFitnessGate(id);
      navigate(`/app/challenges/${id}`);
    }
  }, [timeoutCount, id, navigate, MAX_TIMEOUTS]);

  if (!challenge || questions.length === 0 || !currentQuestion) {
    return null;
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      return;
    }

    if (selectedAnswer === currentQuestion.correct) {
      setTimeoutCount(0);
      console.log('Quiz progress/correct - timeout count reset');
      if (questionIndex < questions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        return;
      }

      markChallengeCompleted(challenge.id, challenge.xp);
      setIsCompleted(true);
      playApplauseSound();
      return;
    }

    setIsWrong(true);
    setWrongReason("answer");
    setTimeout(() => {
      setIsWrong(false);
      setWrongReason(null);
      setSelectedAnswer(null);
      setTimeLeft(QUESTION_TIME_LIMIT_SECONDS);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-16 gap-6 bg-slate-950">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app/quiz")}
          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-black tracking-wide text-slate-100 uppercase">{challenge.title} Quiz</h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest">{challenge.category}</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        {isCompleted ? (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-emerald-300" />
            </div>
            <h2 className="text-xl font-black text-white">Quiz Completed</h2>
            <p className="text-sm text-slate-300 mt-2">You earned +{challenge.xp} XP.</p>
            <button
              onClick={() => navigate("/app/quiz")}
              className="mt-5 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black uppercase tracking-widest"
            >
              Back to Quizzes
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Question {questionIndex + 1} of {questions.length}
              </p>
              <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                timeLeft <= 5 ? "text-red-300 bg-red-500/20 border border-red-500/40" : "text-amber-300 bg-amber-500/20 border border-amber-500/40"
              }`}>
                {timeLeft}s
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-4">{currentQuestion.q}</h2>

            <div className="space-y-3 mb-5">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full p-3 rounded-xl border text-sm text-left flex items-center justify-between ${
                    selectedAnswer === idx
                      ? isWrong
                        ? "bg-red-500/20 border-red-400 text-red-100"
                        : "bg-indigo-500/20 border-indigo-400 text-indigo-100"
                      : "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {option}
                  {selectedAnswer === idx && isWrong && <XCircle size={16} className="text-red-300" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || isWrong}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest ${
                selectedAnswer !== null && !isWrong
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isWrong ? (wrongReason === "timeout" ? "Time's Up, Try Again" : "Incorrect, Try Again") : "Submit Answer"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
