import QuestionsList from "./questions-list";
import { getQuestionsPage } from "@/lib/questions";

// Render on every request (don't cache/prerender) so new questions show up.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

// Server component — runs only on the server, awaits the data, renders to HTML.
export default async function Page() {
  const { questions, hasMore } = await getQuestionsPage(0, PAGE_SIZE);

  return (
    <main className="relative mx-auto w-full max-w-4xl px-5 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(192,132,252,0.14),transparent_30%)] blur-2xl" />
      <header className="mb-8 rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(6,11,24,0.92),rgba(10,16,30,0.88))] p-6 shadow-[0_0_42px_rgba(56,189,248,0.12)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_18px_rgba(56,189,248,0.18)]">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(125,211,252,0.95)]" />
              Neon Live
            </span>
            <h1 className="text-4xl font-black tracking-[0.22em] text-cyan-50 drop-shadow-[0_0_14px_rgba(56,189,248,0.25)] sm:text-5xl">
              CYBER Q&amp;A
            </h1>
            <p className="mt-3 text-sm text-slate-200/90 sm:text-base">
              Ask sharp questions, surface the best ideas, and keep the conversation moving with a clean, high-contrast feed.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            {[
              ["Trending", "Top threads rising fast"],
              ["Live", "Fresh questions in real time"],
              ["Smart", "Searchable and easy to scan"],
            ].map(([label, desc]) => (
              <article
                key={label}
                className="rounded-2xl border border-white/8 bg-white/6 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-100/80">{label}</p>
                <p className="mt-1 text-sm text-slate-100/95">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </header>
      <QuestionsList initialQuestions={questions} initialHasMore={hasMore} />
    </main>
  );
}
