"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setSubscribers(data);
    setLoading(false);
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.first_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl min-h-screen p-8 mx-auto bg-stone-50">
      <header className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Audience</h1>
          <p className="mt-1 text-sm text-stone-600">Manage your Shama Journal mailing list.</p>
        </div>
        <div className="text-right">
          <span className="font-serif text-3xl font-bold text-emerald-800">{subscribers.length}</span>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Subscribers</p>
        </div>
      </header>

      <section className="overflow-hidden bg-white border shadow-sm border-stone-200 rounded-2xl">
        <div className="flex flex-col items-center justify-between gap-4 p-6 border-b border-stone-100 bg-stone-50/50 md:flex-row">
          <input 
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-xs p-2.5 bg-white border border-stone-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={fetchSubscribers}
            className="text-xs font-bold tracking-widest uppercase text-emerald-800 hover:text-emerald-900"
          >
            Refresh List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b">Contact</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b">Status</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b">Joined</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-stone-400 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="p-8 border-b bg-stone-50/30 border-stone-50"></td>
                  </tr>
                ))
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 italic text-center text-stone-400">No subscribers found.</td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-stone-50/50">
                    <td className="p-4 border-b border-stone-100">
                      <div className="font-bold text-stone-900">{sub.first_name || 'Anonymous'} {sub.last_name || ''}</div>
                      <div className="text-xs text-stone-500">{sub.email}</div>
                    </td>
                    <td className="p-4 border-b border-stone-100">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                        sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs border-b border-stone-100 text-stone-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b border-stone-100">
                      <button className="text-xs font-bold transition-colors text-stone-400 hover:text-red-600">
                        Unsubscribe
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}