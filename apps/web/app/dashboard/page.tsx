"use client";

import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard(): JSX.Element {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
        <p className="text-lg">
          Welcome, <span className="font-semibold">{user.firstName}</span>!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Sign Out
      </button>
    </div>
  );
}
