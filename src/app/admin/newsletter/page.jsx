"use client";

import { useState } from "react";

export default function NewsletterAdmin() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const sendNewsletter = async () => {
    setSending(true);

    await fetch("/api/send-newsletter", {
      method: "POST",
      body: JSON.stringify({ subject, content }),
    });

    setSending(false);
    alert("Newsletter sent!");
  };

  return (
    <div className="max-w-3xl p-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Send Newsletter</h1>

      <input
        className="w-full p-3 mb-4 border rounded"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="w-full h-64 p-3 mb-4 border rounded"
        placeholder="Write newsletter..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={sendNewsletter}
        className="px-6 py-3 text-white rounded bg-emerald-700"
      >
        {sending ? "Sending..." : "Send Newsletter"}
      </button>
    </div>
  );
}