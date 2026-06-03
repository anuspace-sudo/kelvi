"use client";
import { useState, useEffect } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Debounced search: wait 300ms after typing stops; each keystroke cancels
  // the previous timer, so "deploying" fires one request, not nine.
  useEffect(() => {
    const id = setTimeout(async () => {
      const url = query
        ? `/api/questions?q=${encodeURIComponent(query)}`
        : `/api/questions`;
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions);
      setHasMore(data.hasMore);
    }, 300);

    return () => clearTimeout(id); // cancel the pending timer on each keystroke
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    });
    const created = await res.json();

    setQuestions((qs) => [{ ...created, votes: 0 }, ...qs]);
    setDraft("");
  }

  async function upvote(id: string) {
    // optimistic: assume success, update the UI now
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, votes: q.votes + 1 } : q))
    );

    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId: getVoterId() }),
    });

    // server said no (already voted) — roll back
    if (!res.ok) {
      setQuestions((qs) =>
        qs.map((q) => (q.id === id ? { ...q, votes: q.votes - 1 } : q))
      );
    }
  }

  async function loadMore() {
    setLoading(true);
    const res = await fetch(`/api/questions?offset=${questions.length}`);
    const data = await res.json();
    setQuestions((qs) => [...qs, ...data.questions]);
    setHasMore(data.hasMore);
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-5 rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(6,11,24,0.94),rgba(8,15,28,0.96))] p-4 shadow-[0_0_30px_rgba(56,189,248,0.08)] backdrop-blur-xl sm:p-5 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-white/8 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/80">Ask something</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Ask a question…"
              className="flex-1 rounded-2xl border border-cyan-400/25 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.08)] outline-none placeholder:text-slate-400 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              onClick={submit}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,211,252,0.45)]"
            >
              Ask
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-300/90">Tip: the strongest questions rise to the top with community votes.</p>
        </article>

        <article className="rounded-3xl border border-fuchsia-400/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(9,14,26,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-fuchsia-100/80">Community pulse</p>
          <div className="mt-4 space-y-3 text-sm text-slate-100/95">
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/6 px-3 py-2.5">
              <span>Active topics</span>
              <strong className="text-cyan-100">{questions.length}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/6 px-3 py-2.5">
              <span>Search mode</span>
              <strong className="text-fuchsia-100">{query ? "Filtered" : "All"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/6 px-3 py-2.5">
              <span>Status</span>
              <strong className="text-emerald-100">{hydrated ? "Interactive" : "Loading"}</strong>
            </div>
          </div>
        </article>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="w-full flex-1 rounded-2xl border border-fuchsia-400/20 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_0_0_1px_rgba(217,70,239,0.08)] outline-none placeholder:text-slate-400 transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-400/25"
        />
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-emerald-100 shadow-[0_0_12px_rgba(74,222,128,0.12)]">
          {hydrated ? "Live ✓" : "Loading…"}
        </span>
      </div>

      <ul className="space-y-3">
        {questions.map((q) => (
          <li
            key={q.id}
            className="group flex items-start gap-3 rounded-3xl border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(8,15,28,0.98))] p-4 shadow-[0_0_24px_rgba(56,189,248,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.18)]"
          >
            <button
              onClick={() => upvote(q.id)}
              className="flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border border-cyan-400/25 bg-cyan-400/8 px-3.5 py-2 text-cyan-100 shadow-[0_0_14px_rgba(56,189,248,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-400/15 hover:text-white"
            >
              <span className="text-xs leading-none">▲</span>
              <span className="text-sm font-semibold leading-none tabular-nums">
                {q.votes}
              </span>
            </button>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="leading-snug text-slate-100">{q.body}</p>
              {q.author && (
                <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-slate-400">{q.author}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-300/90">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-2 py-1">Vote</span>
                <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/8 px-2 py-1">Trending</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {questions.length === 0 && (
        <p className="rounded-3xl border border-dashed border-cyan-400/20 bg-black/35 p-8 text-center text-sm text-slate-300 shadow-[0_0_18px_rgba(56,189,248,0.08)]">
          No questions yet — be the first to spark the neon feed.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-2xl border border-fuchsia-400/25 bg-fuchsia-400/10 px-5 py-2.5 text-sm font-semibold text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.12)] transition duration-200 hover:border-fuchsia-300 hover:bg-fuchsia-400/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
