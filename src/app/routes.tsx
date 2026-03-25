import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Dashboard } from "./pages/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import { WelcomePage } from "./pages/WelcomePage";
import { LoginPage } from "./pages/LoginPage";
import { ChallengeModule } from "./pages/ChallengeModule";
import { Challenges } from "./pages/Challenges";
import { Profile } from "./pages/Profile";
import { Skills } from "./pages/Skills";
import { Settings } from "./pages/Settings";
import { FitnessPage } from "./pages/FitnessPage";
import { QuizPage } from "./pages/QuizPage";
import { ModuleQuizPage } from "./pages/ModuleQuizPage";
import { ActivitySection } from "./components/ActivitySection";
import { BookOpen, Trophy, Shield, Cpu, Play, CheckCircle2 } from "lucide-react";


export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/welcome", Component: WelcomePage },
  { path: "/login", Component: LoginPage },
  {
    path: "/app",
    Component: Root,
    // Forces HMR
    children: [
      { index: true, Component: Dashboard },
      { path: "skills", Component: Skills },
      { path: "activity", Component: () => (
        <div className="flex flex-col min-h-screen px-4 pt-12 pb-24 gap-6 bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-widest text-slate-100 uppercase">Activity Tracker</h1>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monitor Your Progress</span>
            </div>
          </div>
          <ActivitySection />
        </div>
      ) },
      { path: "challenges", Component: Challenges },
      { path: "challenges/:id", Component: ChallengeModule },
      { path: "quiz", Component: QuizPage },
      { path: "quiz/:id", Component: ModuleQuizPage },
      { path: "fitness", Component: FitnessPage },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
    ],
  },
]);
