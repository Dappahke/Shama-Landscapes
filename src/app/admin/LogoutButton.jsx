"use client";

import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      // 1️⃣ Sign out from Supabase (clears session & local storage)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 2️⃣ Hard redirect to login to ensure middleware/proxy gate triggers
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center justify-center gap-3 w-full px-6 py-4 mt-4 font-bold text-white transition-all bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white group active:scale-[0.95] disabled:opacity-50"
    >
      <LogOut
        size={18}
        className={`transition-colors ${
          loading ? "text-white" : "text-red-500 group-hover:text-white"
        }`}
      />
      <span>{loading ? "EXITING..." : "LOGOUT"}</span>
    </button>
  );
}