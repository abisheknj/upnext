"use client";

import { createClient } from "@/lib/supabase/client";

export default function TestPage() {
  const supabase = createClient();

  console.log(supabase);

  return <div>Supabase Client Ready</div>;
}
