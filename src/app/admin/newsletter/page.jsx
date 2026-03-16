"use client";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export default function NewsletterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!title || !content) return setMessage("Title and content are required");

    const { error } = await supabase.from("newsletter").insert([
      {
        title,
        content,
        status: "draft",
      },
    ]);

    if (error) setMessage(error.message);
    else {
      setMessage("Newsletter draft saved!");
      setTitle("");
      setContent("");
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Newsletter Drafts</h1>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-4 mb-4 border rounded"
      />
      <button
        onClick={handleSave}
        className="px-6 py-2 text-white bg-green-600 rounded"
      >
        Save Draft
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}