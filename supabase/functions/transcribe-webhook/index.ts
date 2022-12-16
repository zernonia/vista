import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.0";

serve(async (req) => {
  try {
    if (req.headers.get("Authorization") !== `Bearer ${Deno.env.get("WEBHOOK_KEY")}`) throw Error("Invalid key");

    const { transcript_id } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const jsonResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcript_id}`, {
      method: "GET",
      headers: {
        authorization: Deno.env.get("ASSEMBLY_AI_KEY") ?? "",
      },
    });
    const jsonData = await jsonResponse.json();
    console.log(jsonData);

    await supabaseClient
      .from("projects")
      .update({
        transcription: jsonData,
      })
      .eq("transcription_id", transcript_id);

    return new Response(JSON.stringify(jsonData), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
