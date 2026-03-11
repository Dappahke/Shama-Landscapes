"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import supabase from "@/lib/supabaseClient";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      handleTokenUnsubscribe(token);
    }
  }, [token]);

  // 🔐 Secure unsubscribe using token
  const handleTokenUnsubscribe = async (unsubscribeToken) => {
    setStatus("loading");

    try {
      const { data, error } = await supabase
        .from("newsletter")
        .update({
          unsubscribed: true,
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          unsubscribe_token: null, // invalidate token
        })
        .eq("unsubscribe_token", unsubscribeToken)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Invalid or expired unsubscribe link.");
      }

      setStatus("success");
      setMessage(
        "You've been successfully unsubscribed from The Shama Journal."
      );
    } catch (err) {
      console.error("Unsubscribe error:", err);
      setStatus("error");
      setMessage(
        "This unsubscribe link is invalid or expired. Please enter your email manually below."
      );
    }
  };

  // Manual fallback unsubscribe
  const handleManualUnsubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    setStatus("loading");

    try {
      const { error } = await supabase
        .from("newsletter")
        .update({
          unsubscribed: true,
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("email", email.toLowerCase().trim());

      if (error) throw error;

      setStatus("success");
      setMessage(
        "You've been successfully unsubscribed from The Shama Journal."
      );
    } catch (err) {
      console.error("Manual unsubscribe error:", err);
      setStatus("error");
      setMessage(
        "Something went wrong. Please try again or contact support."
      );
    }
  };

  // Loading screen when token is processing
  if (token && status === "idle") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-emerald-600" />
          <p className="text-slate-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-3xl md:p-12">
        
        {status === "success" && (
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-emerald-600" />
        )}

        {status === "error" && (
          <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
        )}

        <h1 className="mb-4 text-3xl font-extrabold text-slate-900">
          {status === "success"
            ? "You're Unsubscribed"
            : status === "error"
            ? "Oops!"
            : "Unsubscribe"}
        </h1>

        <p className="mb-8 leading-relaxed text-slate-600">
          {message ||
            "Enter your email below to unsubscribe from The Shama Journal."}
        </p>

        {(status === "error" || !token) && (
          <form onSubmit={handleManualUnsubscribe} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 font-semibold text-white transition-colors bg-emerald-800 rounded-xl hover:bg-emerald-900 disabled:opacity-50"
            >
              {status === "loading" ? "Processing..." : "Unsubscribe Me"}
            </button>
          </form>
        )}

        {status === "success" && (
          <p className="mt-6 text-sm text-slate-500">
            Changed your mind?{" "}
            <Link
              href="/"
              className="font-medium text-emerald-700 hover:underline"
            >
              Re-subscribe anytime
            </Link>
          </p>
        )}

        <p className="mt-8 text-xs text-slate-400">
          Need help? Contact us at{" "}
          <a
            href="mailto:info@shamalandscapes.co.ke"
            className="hover:text-emerald-700"
          >
            info@shamalandscapes.co.ke
          </a>
        </p>
      </div>
    </div>
  );
}