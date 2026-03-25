import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, Target, ClipboardCheck, User } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "./context/AppContext";
import { getCompletedLessons } from "./utils/moduleProgress";

export function Root() {
  const navigate = useNavigate();
  const { hasPreferredUsername, isLoading } = useAppContext();
  const quizzesUnlocked = getCompletedLessons().length > 0;

  useEffect(() => {
    if (!isLoading && !hasPreferredUsername) {
      navigate("/welcome", { replace: true });
    }
  }, [hasPreferredUsername, isLoading, navigate]);

  return (
    <div className="flex bg-slate-950 min-h-screen font-sans text-slate-100 selection:bg-indigo-500/30">
      {/* Sidebar Navigation - Desktop Only */}
      <nav className="hidden lg:flex flex-col w-64 bg-slate-900/80 backdrop-blur-xl border-r border-indigo-500/20 p-6 fixed left-0 top-0 h-screen z-50">
        <div className="mb-12">
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 uppercase">
            SkillUp
          </h1>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <NavItemSidebar to="/app" icon={<Home size={24} />} label="Home" />
          <NavItemSidebar to="/app/challenges" icon={<Target size={24} />} label="Modules" />
          <NavItemSidebar to="/app/quiz" icon={<ClipboardCheck size={24} />} label="Quizzes" disabled={!quizzesUnlocked} />
          <NavItemSidebar to="/app/profile" icon={<User size={24} />} label="Profile" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 scroll-smooth">
          <Outlet />
        </main>
        
        {/* Bottom Nav - Mobile Only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-indigo-500/20 pb-safe z-50">
          <div className="flex justify-around items-center pt-3 pb-4 px-2">
            <NavItem to="/app" icon={<Home size={22} />} label="Home" />
            <NavItem to="/app/challenges" icon={<Target size={22} />} label="Modules" />
            <NavItem to="/app/quiz" icon={<ClipboardCheck size={22} />} label="Quizzes" disabled={!quizzesUnlocked} />
            <NavItem to="/app/profile" icon={<User size={22} />} label="Profile" />
          </div>
        </nav>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, disabled = false }: { to: string; icon: React.ReactNode; label: string; disabled?: boolean }) {
  return (
    <NavLink
      to={to}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-16 gap-1 relative transition-colors duration-300 ${
          disabled
            ? "text-slate-700 cursor-not-allowed"
            : isActive
              ? "text-indigo-400"
              : "text-slate-500 hover:text-slate-300"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase mt-1">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavItemSidebar({ to, icon, label, disabled = false }: { to: string; icon: React.ReactNode; label: string; disabled?: boolean }) {
  return (
    <NavLink
      to={to}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
          disabled
            ? "text-slate-700 cursor-not-allowed"
            : isActive
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex-shrink-0">
            {icon}
          </div>
          <span className="font-semibold tracking-wide uppercase text-sm">{label}</span>
          {isActive && (
            <motion.div
              layoutId="sidebar-indicator"
              className="ml-auto w-1 h-6 bg-indigo-500 rounded-full"
            />
          )}
        </>
      )}
    </NavLink>
  );
}
