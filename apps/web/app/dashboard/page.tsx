"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard(): JSX.Element {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-lg">Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your initiatives and drive outcomes with AI-powered document generation.
        </p>
      </div>

      {/* Initiative List Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Your Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-center text-muted-foreground">
              No initiatives yet. Create your first initiative in Epic 2!
            </p>
            <Button
              disabled
              aria-label="Create initiative - coming soon"
            >
              Create Initiative (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
