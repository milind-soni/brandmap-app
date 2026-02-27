"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export function EmailSignup({ source = "factmaps" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    const { error } = await getSupabase()
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase(), source });

    if (error) {
      if (error.code === "23505") {
        setState("success");
        setMessage("You're already on the list!");
      } else {
        setState("error");
        setMessage("Something went wrong. Try again.");
      }
    } else {
      setState("success");
      setMessage("You're on the list!");
    }
  }

  if (state === "success") {
    return (
      <p className="text-lg font-bold uppercase tracking-wider">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-5 py-4 border-2 border-[#1a1a1a] bg-[#f0f0e8] text-[#1a1a1a] font-mono text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-2 placeholder:text-[#aaa]"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="px-8 py-4 bg-[#8b4513] text-[#f0f0e8] border-2 border-[#1a1a1a] font-black text-sm uppercase tracking-wider hover:bg-[#a0522d] transition-colors disabled:opacity-50 shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a1a]"
      >
        {state === "loading" ? "..." : "Join"}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-600 font-medium sm:absolute sm:bottom-[-28px]">
          {message}
        </p>
      )}
    </form>
  );
}
