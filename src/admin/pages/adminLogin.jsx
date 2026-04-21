import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminToken", "authenticated");
      navigate("/admin");
    } else {
      setError("Invalid credentials. Access denied.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* SUBTLE PROFESSIONAL ACCENTS */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-slate-100 rounded-full blur-[100px] pointer-events-none opacity-60" />

      <div className="relative w-full max-w-[420px] md:max-w-[800px]">
        {/* MAIN CARD: Two-column layout on wide screens */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
          
          <div className="flex flex-col md:flex-row">
            
            {/* LEFT: MINIMAL BRANDING */}
            <div className="w-full md:w-[38%] p-8 md:p-12 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">Jojo Lechon</h1>
              <p className="text-slate-400 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em]">Admin Terminal</p>
            </div>

            {/* RIGHT: CLEAN FORM */}
            <div className="w-full md:w-[62%] p-8 md:p-14">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-5">
                  {/* IDENTITY */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Identity</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-slate-50 text-slate-900 text-base border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Access Key</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 text-slate-900 text-base border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase transition-colors"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 py-3 px-4 rounded-xl flex items-center gap-3">
                    <span className="text-red-600 text-xs font-medium">{error}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold text-base py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  <span className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}>
                    Sign In to Portal
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" />
                    </svg>
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MINIMAL FOOTER */}
        <div className="mt-8 flex justify-center items-center">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            Secure Authentication Protocol
          </p>
        </div>
      </div>
    </div>
  );
}