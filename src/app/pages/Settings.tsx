import { useState, useRef } from "react";
import { ArrowLeft, Upload, KeyRound, ShieldCheck, Check, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

export function Settings() {
  const navigate = useNavigate();
  const { profilePic, setProfilePic, logout } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8 lg:px-12 pt-8 md:pt-12 pb-12 md:pb-24 gap-8 bg-slate-950 text-slate-200">
      <div className="flex items-center gap-4 mb-2 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-widest text-slate-100 uppercase">Settings</h1>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manage Account</span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Profile Picture Upload */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest pl-2 border-l-2 border-indigo-500 flex items-center gap-2">
            <Upload size={16} className="text-indigo-400" />
            Edit Profile
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-slate-800 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500">No Img</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={24} className="text-white drop-shadow-md" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-200">Profile Picture</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Tap to change</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Change Password */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest pl-2 border-l-2 border-fuchsia-500 flex items-center gap-2">
            <KeyRound size={16} className="text-fuchsia-400" />
            Security
          </h2>
          <form onSubmit={handlePasswordSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-medium text-slate-200 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-medium text-slate-200 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_5px_15px_-5px_rgba(192,38,211,0.5)] active:scale-95 flex items-center justify-center gap-2"
            >
              {passwordSaved ? (
                <>
                  <Check size={16} /> Password Updated
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> Save Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Log Out */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest pl-2 border-l-2 border-red-500 flex items-center gap-2">
            <LogOut size={16} className="text-red-400" />
            Account
          </h2>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
