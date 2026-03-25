import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Footprints, Activity, Play, Star, Square, Smartphone, PauseCircle, Zap, Timer, Trophy } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface ActivityType {
  id: string;
  name: string;
  xpMultiplier: number;
  icon: string;
  description: string;
  unlockLevel: number;
}

export const activityTypes: ActivityType[] = [
  { id: "normal-walk", name: "Normal Walking", xpMultiplier: 1, icon: "🚶‍♂️", description: "Casual walking pace", unlockLevel: 1 },
  { id: "walking", name: "Brisk Walking", xpMultiplier: 1.5, icon: "🚶", description: "Energetic pace walking", unlockLevel: 3 },
  { id: "light-jog", name: "Light Jogging", xpMultiplier: 2, icon: "🏃", description: "Slow jogging", unlockLevel: 5 },
  { id: "moderate-jog", name: "Moderate Jogging", xpMultiplier: 2.5, icon: "🏃💨", description: "Steady pace", unlockLevel: 8 },
  { id: "fast-jog", name: "Fast Jogging", xpMultiplier: 3, icon: "💨", description: "Fast pace running", unlockLevel: 11 },
  { id: "sprint", name: "Sprinting", xpMultiplier: 4, icon: "⚡", description: "High intensity bursts", unlockLevel: 15 },
  { id: "endurance", name: "Endurance Sprinting", xpMultiplier: 5, icon: "🔥", description: "Prolonged high intensity", unlockLevel: 18 },
];

export function ActivitySection() {
  const { steps, xp, level, addSteps } = useAppContext();
  
  const [isActive, setIsActive] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isMotionSupported, setIsMotionSupported] = useState<boolean | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [hasStartedBefore, setHasStartedBefore] = useState(false);
  
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Implement real device motion pedometer logic with auto-pause
  useEffect(() => {
    let lastMagnitude = 0;
    let lastStepTime = 0;
    let stepConfirmed = false;
    let fallbackTimeout: ReturnType<typeof setTimeout>;

    const handleMotion = (event: DeviceMotionEvent) => {
      // Use acceleration (without gravity) for more accurate step detection
      const acc = event.acceleration;
      if (!acc) {
        // Fallback to accelerationIncludingGravity if acceleration is not available
        const accWithGravity = event.accelerationIncludingGravity;
        if (!accWithGravity) {
          setIsMotionSupported(false);
          return;
        }
      }
      
      if (isMotionSupported === null) {
        setIsMotionSupported(true);
      }
      
      if (!isActive || !selectedActivity) return;

      const now = Date.now();
      
      // Calculate magnitude of acceleration (more accurate than single axis)
      const x = acc?.x ?? 0;
      const y = acc?.y ?? 0;
      const z = acc?.z ?? 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      // Step detection algorithm:
      // 1. Detect significant change in acceleration (step-like motion)
      // 2. Enforce minimum time between steps (250ms) to prevent double counting
      // 3. Require crossing threshold (step occurs when magnitude goes above ~10-12 m/s² due to movement)
      
      const delta = Math.abs(magnitude - lastMagnitude);
      const timeSinceLastStep = now - lastStepTime;
      
      // Enhanced threshold detection - looking for step-like patterns
      // When walking/jogging, acceleration magnitude typically oscillates between 9.8 and higher values
      // A step causes a characteristic "peak" in acceleration
      const isStepLike = magnitude > 11 && magnitude < 25; // Normal walking range
      const isSignificantChange = delta > 3; // Significant acceleration change
      const enoughTimePassed = timeSinceLastStep > 250; // Minimum 250ms between steps
      
      if (isStepLike && isSignificantChange && enoughTimePassed) {
        if (!stepConfirmed) {
          // First sign of step - confirm in next reading
          stepConfirmed = true;
        } else {
          // Confirmed step
          addSteps(1, selectedActivity.xpMultiplier);
          lastStepTime = now;
          stepConfirmed = false;
          
          // Motion detected: disable idle state
          if (isIdle) setIsIdle(false);
          
          // Reset the idle auto-pause timer
          if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          
          // Auto-pause if no steps for 6 seconds
          idleTimeoutRef.current = setTimeout(() => {
            setIsIdle(true);
          }, 6000);
        }
      }
      
      // Reset confirmation if no step pattern detected
      if (!isStepLike) {
        stepConfirmed = false;
      }
      
      lastMagnitude = magnitude;
    };

    window.addEventListener("devicemotion", handleMotion);
    
    // Check if motion data is arriving for support detection
    fallbackTimeout = setTimeout(() => {
      if (lastMagnitude === 0 && isMotionSupported === null) {
        setIsMotionSupported(false);
      }
    }, 2000);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      clearTimeout(fallbackTimeout);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [isActive, isMotionSupported, isIdle, selectedActivity]);

  const toggleActivity = async () => {
    if (!isActive) {
      // Require activity selection before starting
      if (!selectedActivity) {
        alert("Please select an activity type first!");
        return;
      }
      
      setHasStartedBefore(true);
      
      // Request permission for iOS devices
      if (typeof (DeviceMotionEvent as any) !== "undefined" && typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permission = await (DeviceMotionEvent as any).requestPermission();
          if (permission === "granted") {
            setIsActive(true);
            setIsIdle(false);
            
            // Set initial idle timeout
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 6000);
          } else {
            alert("Motion permission is required to track actual steps.");
            setIsMotionSupported(false);
          }
        } catch (error) {
          console.error("Error requesting motion permission:", error);
          setIsMotionSupported(false);
        }
      } else {
        setIsActive(true);
        setIsIdle(false);
        
        // Set initial idle timeout
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 6000);
      }
    } else {
      setIsActive(false);
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    }
  };
  
  const stepGoal = 1000;
  const progressPercent = Math.min((steps / stepGoal) * 100, 100);

  const getStatusText = () => {
    if (!isActive) return "Paused";
    if (isMotionSupported === false) return "Sensor Unavailable";
    if (isIdle) return "Auto-Paused (No Motion)";
    return "Tracking Active";
  };

  const getStatusColor = () => {
    if (!isActive) return "text-slate-400 bg-slate-950/50";
    if (isMotionSupported === false) return "text-red-400 bg-red-950/50";
    if (isIdle) return "text-amber-400 bg-amber-950/50 border border-amber-900/50";
    return "text-cyan-400 bg-cyan-950/50 border border-cyan-900/50";
  };

  return (
    <div className="relative w-full rounded-[2rem] bg-slate-900/60 border border-slate-800 p-6 shadow-xl backdrop-blur-md overflow-hidden transition-all duration-500">
      {/* Background Pulse Effect */}
      <AnimatePresence>
        {isActive && !isIdle && isMotionSupported !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-cyan-500/20 rounded-[2rem] blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          {isActive && isIdle ? (
            <PauseCircle size={18} className="text-amber-400 animate-pulse" />
          ) : (
            <Activity size={18} className={isActive && isMotionSupported !== false ? "animate-pulse" : ""} />
          )}
          Daily Mission
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-indigo-400 uppercase">Lv. {Math.min(level, 20)}/20</span>
          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md transition-colors ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        {/* Step Counter */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
          <Footprints size={24} className={`mb-2 ${isActive && !isIdle && isMotionSupported !== false ? "text-cyan-400 animate-bounce" : "text-slate-500"}`} />
          <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
            {steps.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
            / {stepGoal.toLocaleString()} Steps
          </span>
          
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
          </div>
        </div>

        {/* XP Meter */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
          <Star size={24} className={`mb-2 ${isActive && !isIdle && isMotionSupported !== false ? "text-amber-400 animate-pulse" : "text-slate-500"}`} />
          <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
            +{xp.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wider mt-1">
            XP Earned
          </span>
          
          <div className="absolute -right-4 -bottom-4 w-20 h-20 border-4 border-amber-500/10 rounded-full" />
        </div>
      </div>

      {/* Activity Type Selector - Always Visible */}
      <div className="mb-4 relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          {!hasStartedBefore ? "👆 Select Activity First" : "Current Activity"}
        </p>
        {!hasStartedBefore ? (
          /* Initial state: Large selection grid */
          <div className="grid grid-cols-2 gap-2">
            {activityTypes.map((activity) => {
              const isUnlocked = level >= activity.unlockLevel;
              return (
                <button
                  key={activity.id}
                  onClick={() => isUnlocked && setSelectedActivity(activity)}
                  disabled={!isUnlocked}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                    selectedActivity?.id === activity.id
                      ? "bg-orange-500/30 border-orange-500 scale-105"
                      : isUnlocked
                        ? "bg-slate-950/50 border-slate-700 hover:border-orange-500/50 hover:scale-102 cursor-pointer"
                        : "bg-slate-950/30 border-slate-800 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl mb-1">{isUnlocked ? activity.icon : "🔒"}</span>
                  <p className={`text-[10px] font-bold text-center ${isUnlocked ? "text-slate-200" : "text-slate-500"}`}>
                    {activity.name}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {isUnlocked ? (
                      <>
                        <Zap size={10} className="text-amber-400" />
                        <span className="text-[9px] font-black text-amber-400">x{activity.xpMultiplier}</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-black text-slate-500">Lv. {activity.unlockLevel}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* After starting: Show selected activity with option to change */
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedActivity?.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-200">{selectedActivity?.name}</p>
                <p className="text-[10px] text-slate-500">{selectedActivity?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-sm font-black text-amber-400">x{selectedActivity?.xpMultiplier} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: selectedActivity ? 1.02 : 1 }}
        whileTap={{ scale: selectedActivity ? 0.98 : 1 }}
        onClick={toggleActivity}
        disabled={!selectedActivity && !hasStartedBefore}
        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden z-10 ${
          !selectedActivity && !hasStartedBefore
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : isActive 
              ? "bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
              : "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_10px_20px_-10px_rgba(6,182,212,0.5)]"
        }`}
      >
        {isActive ? (
          <>
            <Square size={16} fill="currentColor" />
            Stop Tracking
          </>
        ) : !selectedActivity && !hasStartedBefore ? (
          <>
            <Play size={18} />
            Select Activity to Start
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" />
            Start Activity
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/20 to-transparent skew-x-12 translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
          </>
        )}
      </motion.button>
      
      {/* Info text */}
      <p className="text-[10px] text-center text-slate-500 mt-4 font-medium tracking-wide flex items-center justify-center gap-1.5">
        <Smartphone size={12} />
        {isMotionSupported === false 
          ? "Device motion sensors unavailable on this device." 
          : isActive && isIdle 
            ? "Tracking paused. Move device to resume." 
            : "Keep your device on you to track real steps."}
      </p>
    </div>
  );
}
