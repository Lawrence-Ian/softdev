import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Activity, BookOpen, Dumbbell } from "lucide-react";

const slides = [
  {
    title: "Welcome to SkillUp",
    description: "Track your movement, gain XP, and unlock IT modules as you level up.",
    icon: <Activity size={28} className="text-cyan-300" />,
  },
  {
    title: "Learn by Modules",
    description: "Each module has focused lessons and unlock requirements based on your level.",
    icon: <BookOpen size={28} className="text-indigo-300" />,
  },
  {
    title: "Fitness Before Quiz",
    description: "Complete a short fitness challenge before every assessment attempt.",
    icon: <Dumbbell size={28} className="text-emerald-300" />,
  },
];

const ONBOARDING_DONE_KEY = "onboardingCompleted";

export function LandingPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const isLastSlide = useMemo(() => activeIndex === slides.length - 1, [activeIndex]);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_DONE_KEY, "true");
    navigate("/welcome");
  };

  const goNext = () => {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    setActiveIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const goPrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      goNext();
    } else if (diff < -50) {
      goPrev();
    }

    touchStartXRef.current = null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Onboarding</p>
        <button
          onClick={completeOnboarding}
          className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
            {slides[activeIndex].icon}
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-3">{slides[activeIndex].title}</h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">{slides[activeIndex].description}</p>
          <p className="text-xs text-slate-500 mt-6">Swipe left/right to navigate onboarding.</p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index ? "w-7 bg-cyan-400" : "w-2.5 bg-slate-700"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={goNext}
        className="w-full mt-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors"
      >
        {isLastSlide ? "Continue" : "Next"}
      </button>
    </div>
  );
}
