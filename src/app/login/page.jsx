"use client";

import { useState, Suspense } from "react";
import supabase from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const authError = searchParams.get("error");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Force a refresh to sync cookies with Middleware
        router.refresh(); 
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col w-full max-w-md gap-6 p-10 border shadow-2xl bg-white/90 backdrop-blur-md rounded-3xl border-white/20"
    >
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-32 h-16 mb-4">
          <Image 
            src="/shama_landscape_logo.png" 
            alt="Shama Landscape Architects" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        <p className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase">
          Authorized Access Only
        </p>
      </div>

      {(error || authError) && (
        <div className="p-3 text-center border border-red-100 bg-red-50 rounded-xl">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">
            {error || (authError === "unauthorized" ? "Access Denied: Admin Only" : "Session Expired")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 transition-all border outline-none bg-white/50 border-stone-200 rounded-xl focus:border-emerald-800 text-stone-800"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 transition-all border outline-none bg-white/50 border-stone-200 rounded-xl focus:border-emerald-800 text-stone-800"
        />
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-950 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50 uppercase tracking-widest text-xs"
      >
        {loading ? "Verifying..." : "Enter Dashboard"}
      </button>
    </form>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-md gap-5 p-10 bg-white/90 rounded-3xl animate-pulse">
      <div className="h-20 mb-4 bg-stone-200 rounded-xl"></div>
      <div className="space-y-4">
        <div className="h-14 bg-stone-100 rounded-xl"></div>
        <div className="h-14 bg-stone-100 rounded-xl"></div>
      </div>
      <div className="mt-4 h-14 bg-stone-200 rounded-xl"></div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden">
      {/* Background Image */}
      <Image 
        src="/assets/hero-poster.png" 
        alt="Background"
        fill
        className="z-0 object-cover"
        priority
      />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 z-10 bg-stone-900/40"></div>

      <div className="relative z-20 flex justify-center w-full">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}