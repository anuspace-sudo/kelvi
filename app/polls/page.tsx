"use client";

import { useEffect, useState } from "react";

type PollOption = {
  id: number;
  option_text: string;
  poll_votes: {
    count: number;
  }[];
};

type Poll = {
  id: number;
  question: string;
  poll_options: PollOption[];
};
export default function PollsPage() {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [polls, setPolls] = useState<Poll[]>([]);

  async function loadPolls() {
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPolls(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

useEffect(() => {
  const fetchPolls = async () => {
    try {
      const res = await fetch("/api/polls");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPolls(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchPolls();
}, []);

  async function createPoll() {
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        options: [option1, option2, option3],
      }),
    });

    if (res.ok) {
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");

      await loadPolls();

      alert("Poll created successfully!");
    }
  }

  async function vote(pollId: number, optionId: number) {
  const res = await fetch(`/api/polls/${pollId}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      optionId,
    }),
  });

  if (res.ok) {
    await loadPolls();
  }
}

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Polls</h1>

      <div className="mb-10 space-y-3">
        <input
          className="w-full rounded border p-3"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Option 1"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Option 2"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Option 3"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
        />

        <button
          onClick={createPoll}
          className="rounded border px-4 py-2"
        >
          Create Poll
        </button>
      </div>

      <div className="space-y-4">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="rounded border p-4"
          >
            <h2 className="mb-3 text-lg font-semibold">
              {poll.question}
            </h2>

            {poll.poll_options?.map((option) => (
  <div key={option.id} className="mb-2">
    <button
      onClick={() => vote(poll.id, option.id)}
      className="rounded border px-3 py-2"
    >
      {option.option_text} (
      {option.poll_votes?.[0]?.count ?? 0} votes)
    </button>
  </div>
))}
          </div>
        ))}
      </div>
    </main>
  );
}