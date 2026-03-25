import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";

export function WelcomePage() {
  const navigate = useNavigate();
  const { setPreferredUsername } = useAppContext();
  const [name, setName] = useState("");

  const handleContinue = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) {
      return;
    }

    await setPreferredUsername(cleanName);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 md:px-8 py-8 md:py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Profile Setup</p>
        <h1 className="text-2xl md:text-3xl font-black mb-3">Choose your username</h1>
        <p className="text-sm md:text-base text-slate-300 mb-6">This will be used across your dashboard, modules, and profile.</p>

        <form onSubmit={handleContinue} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter preferred username"
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            maxLength={24}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
