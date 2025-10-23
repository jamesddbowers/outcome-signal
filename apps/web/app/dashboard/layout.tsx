"use client";

import React from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TrialBadge from "@/components/subscription/TrialBadge";
import { useEnsureSubscription } from "@/lib/hooks/useEnsureSubscription";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { isLoading: subscriptionLoading, subscription, error: subscriptionError } = useEnsureSubscription();

  const handleSignOut = async (): Promise<void> => {
    // Clerk handles redirect automatically after signOut
    await signOut();
  };

  if (!isLoaded || subscriptionLoading) {
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

  if (subscriptionError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-destructive">
          Error setting up your account: {subscriptionError}
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Setting up your account...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">OutcomeSignal</h1>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            {/* Trial Badge */}
            <TrialBadge subscription={subscription} />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{user.firstName}</span>
              </span>
            </div>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <Button
              variant="ghost"
              onClick={handleSignOut}
              aria-label="Sign out of your account"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
