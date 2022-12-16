import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  try {
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const { video_key } = await req.json();

    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });
    const { data: videoData, error: videoError } = await supabaseClient.storage
      .from("assets")
      .createSignedUrl(video_key, 600);
    if (videoError) throw Error(videoError.message);

    const jsonResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: Deno.env.get("ASSEMBLY_AI_KEY") ?? "",
      },
      body: JSON.stringify({
        audio_url: videoData?.signedUrl,
        webhook_url: `${Deno.env.get("SUPABASE_FUNCTION_URL")}/transcribe-webhook`,
        webhook_auth_header_name: "Authorization",
        webhook_auth_header_value: `Bearer ${Deno.env.get("WEBHOOK_KEY")}`,
      }),
    });
    const jsonData = await jsonResponse.json();

    return new Response(JSON.stringify(jsonData), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
