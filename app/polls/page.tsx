"use client";

import { useEffect, useState } from "react";

type PollOption = {
  id: number;
  option_text: string;
  poll_votes: { count: number }[];
};

type Poll = {
  id: number;
  question: string;
  poll_options: PollOption[];
};

export default function PollsPage() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPolls() {
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();
      if (Array.isArray(data)) setPolls(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { loadPolls(); }, []);

  async function createPoll() {
    const filledOptions = options.filter((o) => o.trim());
    if (!question.trim() || filledOptions.length < 2) {
      setError("Please enter a question and at least 2 options.");
      return;
    }
    setError(null);
    setCreating(true);

    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options: filledOptions }),
    });

    setCreating(false);

    if (res.ok) {
      setQuestion("");
      setOptions(["", "", ""]);
      await loadPolls();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to create poll.");
    }
  }

  async function vote(pollId: number, optionId: number) {
    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    if (res.ok) await loadPolls();
  }

  function totalVotes(poll: Poll) {
    return poll.poll_options.reduce(
      (sum, o) => sum + (o.poll_votes?.[0]?.count ?? 0),
      0
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl px-5 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_30%)] blur-2xl" />

      <header className="mb-8 rounded-[28px] border border-violet-400/20 bg-[linear-gradient(135deg,rgba(6,11,24,0.92),rgba(10,16,30,0.88))] p-6 shadow-[0_0_42px_rgba(167,139,250,0.12)] backdrop-blur-xl sm:p-8">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.18)]">
          <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.95)]" />
          Community Polls
        </span>
        <h1 className="text-4xl font-black tracking-[0.22em] text-violet-50 drop-shadow-[0_0_14px_rgba(167,139,250,0.25)] sm:text-5xl">
          POLLS
        </h1>
        <p className="mt-3 text-sm text-slate-200/90 sm:text-base">
          Create a poll, cast your vote, and see where the community stands.
        </p>
      </header>

      {/* Create poll */}
      <section className="mb-8 rounded-[28px] border border-violet-400/20 bg-[linear-gradient(135deg,rgba(6,11,24,0.94),rgba(8,15,28,0.96))] p-6 shadow-[0_0_30px_rgba(167,139,250,0.08)] backdrop-blur-xl">
        <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-violet-100/80">Create a poll</p>

        <div className="space-y-3">
          <input
            className="w-full rounded-2xl border border-violet-400/25 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30"
            placeholder="Poll question…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {options.map((opt, i) => (
            <input
              key={i}
              className="w-full rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/20"
              placeholder={`Option ${i + 1}${i >= 2 ? " (optional)" : ""}`}
              value={opt}
              onChange={(e) => {
                const next = [...options];
                next[i] = e.target.value;
                setOptions(next);
              }}
            />
          ))}

          {error && (
            <p className="rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            onClick={createPoll}
            disabled={creating}
            className="rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(167,139,250,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(196,181,253,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
          >
            {creating ? "Creating…" : "Create Poll"}
          </button>
        </div>
      </section>

      {/* Poll list */}
      <ul className="space-y-4">
        {polls.map((poll) => {
          const total = totalVotes(poll);
          return (
            <li
              key={poll.id}
              className="rounded-[28px] border border-violet-400/15 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(8,15,28,0.98))] p-6 shadow-[0_0_24px_rgba(167,139,250,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.18)]"
            >
              <h2 className="mb-4 text-base font-bold text-slate-100">
                {poll.question}
              </h2>

              <div className="space-y-2">
                {poll.poll_options?.map((option) => {
                  const count = option.poll_votes?.[0]?.count ?? 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <button
                      key={option.id}
                      onClick={() => vote(poll.id, option.id)}
                      className="group w-full rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left transition duration-200 hover:border-violet-300/40 hover:bg-violet-400/10"
                    >
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-100">{option.option_text}</span>
                        <span className="text-xs text-slate-400">
                          {count} vote{count !== 1 ? "s" : ""} &bull; {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {total} total vote{total !== 1 ? "s" : ""}
              </p>
            </li>
          );
        })}
      </ul>

      {polls.length === 0 && (
        <p className="rounded-3xl border border-dashed border-violet-400/20 bg-black/35 p-8 text-center text-sm text-slate-300 shadow-[0_0_18px_rgba(167,139,250,0.08)]">
          No polls yet — create the first one above.
        </p>
      )}
    </div>
  );
}
