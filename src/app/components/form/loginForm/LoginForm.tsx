"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { RiUser3Line, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiErrorWarningLine } from "react-icons/ri";

type ErrorResponse = { error: string };

function isErrorResponse(data: any): data is ErrorResponse {
  return (data as ErrorResponse).error !== undefined;
}

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data: Admin | ErrorResponse = await res.json();

      if (!res.ok) {
        if (isErrorResponse(data)) {
          setError(data.error);
        }
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
          Username
        </label>
        <div className="relative group">
          <RiUser3Line
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-gray-600 dark:group-focus-within:text-slate-300 transition-colors duration-200"
          />
          <input
            type="text"
            name="username"
            id="username"
            required
            placeholder="Enter your username"
            className="w-full pl-9 pr-4 py-3 rounded-lg text-sm bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-slate-500 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-400">
          Password
        </label>
        <div className="relative group">
          <RiLockPasswordLine
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-gray-600 dark:group-focus-within:text-slate-300 transition-colors duration-200"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            required
            placeholder="Enter your password"
            className="w-full pl-9 pr-10 py-3 rounded-lg text-sm bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:border-slate-500 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors duration-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50">
          <RiErrorWarningLine size={15} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="relative mt-1 w-full py-3 rounded-lg text-sm font-semibold tracking-wide overflow-hidden
          bg-gradient-to-b from-gray-700 to-slate-900 dark:from-slate-600 dark:to-slate-800
          text-white border border-slate-700/50
          hover:from-gray-600 hover:to-slate-800 dark:hover:from-slate-500 dark:hover:to-slate-700
          disabled:opacity-60 disabled:cursor-not-allowed
          shadow-md shadow-slate-900/20
          transition duration-300"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Authenticating...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
