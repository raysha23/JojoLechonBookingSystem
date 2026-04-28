import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/userLoginApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("adminToken");
    if (raw) navigate("/admin", { replace: true });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await loginAdmin(username, password);
      if (data.role !== "admin") {
        setError("Access denied. Admin accounts only.");
        return;
      }
      localStorage.setItem(
        "adminToken",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          username: data.username,
          role: data.role,
        }),
      );
      navigate("/admin");
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* HEADER */}
        <div className="bg-red-700 px-8 py-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-black text-white">Jojo's Lechon</h1>
          <p className="text-red-200 text-xs mt-1 font-medium uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-bold focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-bold focus:outline-none focus:border-red-400 transition-colors"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-red-700 uppercase transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-red-700 text-white font-black text-sm hover:bg-red-800 transition-all shadow-lg shadow-red-100 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
