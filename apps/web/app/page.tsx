import React from "react";

export default function Page(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to OutcomeSignal
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          AI-powered product planning and documentation platform. Streamline
          your product development workflow with intelligent initiative
          management, automated documentation generation, and real-time
          collaboration.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>Next.js 14 with App Router • TypeScript • Tailwind CSS</p>
          <p>shadcn/ui Scaled Theme • React Server Components</p>
        </div>
      </div>
    </main>
  );
}
