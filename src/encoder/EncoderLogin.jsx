import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EncoderLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid username or password.");
        return;
      }

      const data = await res.json();

      if (data.role !== "encoder") {
        setError("Access denied. Encoder accounts only.");
        return;
      }

      sessionStorage.setItem(
        "encoder",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          username: data.username,
        }),
      );

      navigate("/encoder/book");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="bg-red-700 px-8 py-8 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🐷</span>
          </div>
          <h1 className="text-xl font-black text-white">Jojo's Lechon</h1>
          <p className="text-red-200 text-xs mt-1 font-medium uppercase tracking-widest">
            Encoder Portal
          </p>
        </div>

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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-2xl border-2 border-gray-100 bg-gray-50 text-sm font-bold focus:outline-none focus:border-red-400 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-red-700 text-white font-black text-sm hover:bg-red-800 transition-all shadow-lg shadow-red-100 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
