import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { database } from "../db/database";
import { resetCompletedLessons } from "../utils/moduleProgress";
import { resetAllFitnessGateState } from "../utils/fitnessGate";

interface AppState {
  steps: number;
  xp: number;
  level: number;
  profilePic: string | null;
  completedChallenges: string[];
  studyFocus: string | null;
  userId: number | null;
  username: string;
  hasPreferredUsername: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setPreferredUsername: (name: string) => Promise<void>;
  setStudyFocus: (focus: string | null) => void;
  addSteps: (count: number, xpMultiplier?: number) => void;
  setProfilePic: (url: string | null) => void;
  markChallengeCompleted: (id: string, rewardXp: number) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const DEFAULT_USER_ID = 1; // For demo purposes, use user ID 1
const PREFERRED_USERNAME_KEY = "preferredUsername";

export function AppProvider({ children }: { children: ReactNode }) {
  const [steps, setSteps] = useState(0);
  const [xp, setXp] = useState(0);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [studyFocus, setStudyFocus] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("Player");
  const [hasPreferredUsername, setHasPreferredUsername] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // For demo, try to get user 1 or create default data
        let user = await database.getUser(DEFAULT_USER_ID);
        
        if (!user) {
          // Create a default demo user
          const userId = await database.createUser(
            "Demo User", 
            "demo@skillup.app", 
            "demo123"
          );
          user = await database.getUser(userId);
        }

        if (user) {
          setUserId(user.id!);
          const preferredUsername = localStorage.getItem(PREFERRED_USERNAME_KEY)?.trim();
          if (preferredUsername) {
            setUsername(preferredUsername);
            setHasPreferredUsername(true);
          } else {
            setUsername(user.username);
            setHasPreferredUsername(false);
          }
          setIsGuest(false); // User is logged in, not guest
          
          const progress = await database.getProgress(user.id!);
          if (progress) {
            setSteps(progress.steps);
            setXp(progress.xp);
            setProfilePic(progress.profilePic);
            setStudyFocus(progress.studyFocus);
          }

          const completed = await database.getCompletedChallenges(user.id!);
          setCompletedChallenges(completed.map(c => c.challengeId));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save progress to database
  const addSteps = async (count: number, xpMultiplier: number = 1) => {
    const newSteps = steps + count;
    const newXp = xp + (count * 1 * xpMultiplier);
    const newLevel = Math.floor(newXp / 1000) + 1;
    
    setSteps(newSteps);
    setXp(newXp);
    
    // Only save to database if user is logged in (not guest)
    if (userId && !isGuest) {
      await database.updateProgress(userId, {
        steps: newSteps,
        xp: newXp,
        level: newLevel,
      });
    }
  };

  const markChallengeCompleted = async (id: string, rewardXp: number) => {
    if (!completedChallenges.includes(id)) {
      const newCompleted = [...completedChallenges, id];
      setCompletedChallenges(newCompleted);
      setXp((prev) => {
        const newXp = prev + rewardXp;
        return newXp;
      });

      // Only save to database if user is logged in (not guest)
      if (userId && !isGuest) {
        await database.markChallengeCompleted(userId, id, rewardXp);
      }
    }
  };

  const setProfilePicHandler = async (url: string | null) => {
    setProfilePic(url);
    // Only save to database if user is logged in (not guest)
    if (userId && !isGuest) {
      await database.updateProgress(userId, { profilePic: url });
    }
  };

  const setStudyFocusHandler = async (focus: string | null) => {
    setStudyFocus(focus);
    // Only save to database if user is logged in (not guest)
    if (userId && !isGuest) {
      await database.updateProgress(userId, { studyFocus: focus });
    }
  };

  const setPreferredUsername = async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) {
      return;
    }

    setUsername(cleanName);
    setHasPreferredUsername(true);
    localStorage.setItem(PREFERRED_USERNAME_KEY, cleanName);
  };

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await database.validateUser(email, password);
      if (user && user.id) {
        setUserId(user.id);
        setUsername(user.username);
        setIsGuest(false);
        const preferredUsername = localStorage.getItem(PREFERRED_USERNAME_KEY)?.trim();
        setHasPreferredUsername(Boolean(preferredUsername));
        if (preferredUsername) {
          setUsername(preferredUsername);
        }
        
        const progress = await database.getProgress(user.id);
        if (progress) {
          setSteps(progress.steps);
          setXp(progress.xp);
          setProfilePic(progress.profilePic);
          setStudyFocus(progress.studyFocus);
        }

        const completed = await database.getCompletedChallenges(user.id);
        setCompletedChallenges(completed.map(c => c.challengeId));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user exists
      const existing = await database.getUserByEmail(email);
      if (existing) {
        return false;
      }

      const userId = await database.createUser(username, email, password);
      setUserId(userId);
      setUsername(username);
      setIsGuest(false);
      setHasPreferredUsername(false);
      
      // Initialize default state
      setSteps(0);
      setXp(0);
      setProfilePic(null);
      setStudyFocus(null);
      setCompletedChallenges([]);
      
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = async () => {
    if (userId) {
      await database.resetUserProgress(userId);
    }

    resetCompletedLessons();
    resetAllFitnessGateState();
    localStorage.removeItem(PREFERRED_USERNAME_KEY);

    setUserId(null);
    setUsername("Player");
    setHasPreferredUsername(false);
    setIsGuest(true);
    setSteps(0);
    setXp(0);
    setProfilePic(null);
    setStudyFocus(null);
    setCompletedChallenges([]);
  };

  const MAX_LEVEL = 30;
  const level = Math.min(Math.floor(xp / 1000) + 1, MAX_LEVEL);

  return (
    <AppContext.Provider
      value={{
        steps,
        xp,
        level,
        profilePic,
        completedChallenges,
        studyFocus,
        userId,
        username,
        hasPreferredUsername,
        isGuest,
        isLoading,
        setPreferredUsername,
        setStudyFocus: setStudyFocusHandler,
        addSteps,
        setProfilePic: setProfilePicHandler,
        markChallengeCompleted,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
