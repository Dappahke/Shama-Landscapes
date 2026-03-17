"use client";
import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function SubscribeSection({ title, subtitle }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.from("subscribers").insert([{ email, status: "active" }]);
    if (error) setStatus("error");
    else {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <div className="my-16 overflow-hidden shadow-2xl rounded-3xl bg-stone-900">
      <div className="px-8 py-12 text-center md:px-16 md:py-16">
        <h3 className="mb-4 font-serif text-3xl italic text-white">
          {title || "The Shama Journal"}
        </h3>
        <p className="max-w-md mx-auto mb-8 text-stone-400">
          {subtitle || "Subscribe for monthly reflections on sustainable design and ecological harmony."}
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col max-w-lg gap-3 mx-auto sm:flex-row">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 p-4 text-white transition-all border outline-none rounded-xl border-stone-700 bg-stone-800 focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-4 font-bold text-white transition-all rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50"
          >
            {status === "loading" ? "Joining..." : "Join Narrative"}
          </button>
        </form>
        {status === "success" && <p className="mt-4 text-sm text-emerald-400">Welcome to the inner circle.</p>}
      </div>
    </div>
  );
}