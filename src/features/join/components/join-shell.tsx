type JoinShellProps = {
  title: string;
  description?: string | null;
  children: React.ReactNode;
};

export function JoinShell({ title, description, children }: JoinShellProps) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">
          upNext
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </main>
  );
}
