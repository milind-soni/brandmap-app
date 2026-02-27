"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Sign in failed");
      setLoading(false);
    } else {
      router.push("/editor");
    }
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/editor",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0e8] px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-3xl font-black tracking-tighter text-center mb-8"
        >
          factmaps.
        </Link>

        <div className="bg-white border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a] p-8">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-6">
            Sign In
          </h1>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 text-sm font-medium mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-[#f0f0e8] font-mono text-sm focus:outline-none focus:border-[#8b4513] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#888] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border-2 border-[#1a1a1a] bg-[#f0f0e8] font-mono text-sm focus:outline-none focus:border-[#8b4513] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1a1a1a] text-[#f0f0e8] border-2 border-[#1a1a1a] font-black text-sm uppercase tracking-wider hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#e0e0d8]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-[#888]">
                or
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full py-3 bg-white border-2 border-[#1a1a1a] font-bold text-sm uppercase tracking-wider hover:bg-[#f0f0e8] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-[#888]">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#1a1a1a] hover:text-[#8b4513] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
