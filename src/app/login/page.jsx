"use client";

import { useState, Suspense } from "react";
import supabase from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
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
        window.location.href = "/admin";
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
      className="flex flex-col gap-5 p-10 bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black tracking-tighter text-shama-blue uppercase">
          Shama Portal
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">
          Authorized Access Only
        </p>
      </div>

      {(error || authError) && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
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
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-shama-blue transition-all"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-shama-blue transition-all"
        />
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full py-4 bg-shama-blue text-white font-bold rounded-xl hover:bg-shama-blue/90 transition-all active:scale-[0.98] shadow-lg shadow-shama-blue/20 disabled:opacity-50"
      >
        {loading ? "VERIFYING..." : "ENTER DASHBOARD"}
      </button>
    </form>
  );
}

// Loading fallback
function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-10 bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black tracking-tighter text-shama-blue uppercase">
          Shama Portal
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">
          Authorized Access Only
        </p>
      </div>
      <div className="space-y-4">
        <div className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl h-14 animate-pulse"></div>
        <div className="w-full p-4 bg-gray-100 border border-gray-200 rounded-xl h-14 animate-pulse"></div>
      </div>
      <div className="w-full py-4 bg-gray-300 rounded-xl h-14 animate-pulse"></div>
    </div>
  );
}

// Main page component with Suspense
export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-shama-clay font-montserrat">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}