import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function formatEnvErrors(error: z.ZodError): string {
  const fields = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "env";
      return `  ${path}: ${issue.message}`;
    })
    .join("\n");
  return fields || error.message;
}

function parseEnv<T extends z.ZodType>(
  schema: T,
  data: Record<string, string | undefined>,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const details = formatEnvErrors(result.error);
    const message = `Invalid ${label} environment variables:\n${details}`;
    console.error(`\n❌ ${message}\n`);
    throw new Error(message);
  }

  return result.data;
}

/** Public env — safe for browser bundles and client components. */
export function getPublicEnv(): PublicEnv {
  return parseEnv(
    publicEnvSchema,
    {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    "public",
  );
}

/** Server-only env — includes service role key. Never import from client components. */
export function getServerEnv(): ServerEnv {
  return parseEnv(
    serverEnvSchema,
    {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    "server",
  );
}
