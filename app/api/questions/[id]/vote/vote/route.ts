import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { optionId } = await req.json();
  const { id } = await params;

  const { error } = await supabase
    .from("poll_votes")
    .insert({
      poll_id: id,
      option_id: optionId,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}