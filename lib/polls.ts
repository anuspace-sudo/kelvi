import { supabase } from "@/lib/supabase";

export async function getPollsWithVotes() {
  const { data, error } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (
        *,
        poll_votes(count)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}