import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Dumbbell, Play, TimerReset } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  completeFitnessForToday,
  getFitnessGateState,
  FITNESS_SCORE_REWARD,
} from "../utils/fitnessGate";
import { playTimerTick, playTimerSecondTick, playCompletionSound } from "../utils/audio";

const EXERCISE_DURATION_SECONDS = 30;
const FITNESS_CHALLENGES = ["Jumping Jacks", "Push Ups", "High Knees", "Body Squats"];

export function FitnessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/app/quiz";
  }, [location.search]);

  const fitnessScope = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("module") || "global";
  }, [location.search]);

  const [timeLeft, setTimeLeft] = useState(EXERCISE_DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [canMarkDone, setCanMarkDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(getFitnessGateState(fitnessScope).completed);
  const [selectedChallenge, setSelectedChallenge] = useState(FITNESS_CHALLENGES[0]);
  const [honestyConfirmed, setHonestyConfirmed] = useState(false);

  useEffect(() => {
    setIsCompleted(getFitnessGateState(fitnessScope).completed);
  }, [fitnessScope]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            window.clearInterval(interval);
            setIsRunning(false);
            setCanMarkDone(true);
            playCompletionSound();
            return 0;
          }
          playTimerSecondTick();
          return previous - 1;
        });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const progressPercent = Math.round(
    ((EXERCISE_DURATION_SECONDS - timeLeft) / EXERCISE_DURATION_SECONDS) * 100,
  );

  const handleStartExercise = () => {
    if (isCompleted) {
      return;
    }

    setTimeLeft(EXERCISE_DURATION_SECONDS);
    setCanMarkDone(false);
    setIsRunning(true);
    playTimerTick();
  };

  const handleMarkAsDone = () => {
    completeFitnessForToday(FITNESS_SCORE_REWARD, fitnessScope);
    setIsCompleted(true);
    setCanMarkDone(false);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950">
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 uppercase">
          Quick Fitness Activation
        </h1>
        <p className="text-sm text-slate-300 mt-3">
          Complete this short activity to unlock your IT assessment.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
            <Dumbbell size={20} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">Exercise Challenge</p>
            <p className="text-xs text-slate-400">Keep moving for up to 30 seconds</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Choose challenge</p>
          <div className="grid grid-cols-2 gap-2">
            {FITNESS_CHALLENGES.map((challenge) => (
              <button
                key={challenge}
                onClick={() => setSelectedChallenge(challenge)}
                disabled={isRunning || isCompleted}
                className={`rounded-lg border px-2 py-2 text-[11px] font-bold transition-colors ${
                  selectedChallenge === challenge
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/50"
                    : "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Progress</span>
            <span className="text-xs text-emerald-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-5xl font-black text-white tabular-nums">{timeLeft}s</p>
          <p className="text-xs text-cyan-300 mt-1">Current challenge: {selectedChallenge}</p>
          <p className="text-xs text-slate-400 mt-1">
            {isRunning ? "Stay active... timer running" : "Ready when you are"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleStartExercise}
            disabled={isRunning || isCompleted}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
              isRunning || isCompleted
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            }`}
          >
            <Play size={14} />
            Start Exercise
          </button>

          <button
            onClick={handleMarkAsDone}
            disabled={!canMarkDone || isCompleted}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
              !canMarkDone || isCompleted
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            <TimerReset size={14} />
            Mark as Done
          </button>
        </div>
      </motion.div>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <CheckCircle2 size={28} className="text-emerald-300" />
          </div>
          <p className="text-emerald-200 font-bold">You&apos;re ready for your assessment!</p>
          <p className="text-xs text-slate-300 mt-1">Fitness score earned: +{FITNESS_SCORE_REWARD}</p>

          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-left">
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-200">Honesty is the best policy</p>
            <p className="text-xs text-slate-300 mt-1">Please confirm you honestly completed the selected fitness challenge.</p>
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={honestyConfirmed}
                onChange={(event) => setHonestyConfirmed(event.target.checked)}
                className="accent-emerald-400"
              />
              I completed this challenge honestly.
            </label>
          </div>

          <button
            onClick={() => navigate(redirectTarget)}
            disabled={!honestyConfirmed}
            className={`mt-4 w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
              honestyConfirmed
                ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            Proceed to Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
}
