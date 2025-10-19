"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useInitiatives } from "@/lib/hooks/useInitiatives";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard(): JSX.Element {
  const { user, isLoaded } = useUser();
  const { data: initiatives, isLoading: initiativesLoading } = useInitiatives();

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

      {/* Initiative List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          {initiativesLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading initiatives...</p>
            </div>
          ) : initiatives && initiatives.length > 0 ? (
            <div className="space-y-4">
              {initiatives.map((initiative) => (
                <Link
                  key={initiative.id}
                  href={`/dashboard/initiatives/${initiative.id}`}
                  className="block"
                >
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{initiative.title}</h3>
                          {initiative.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {initiative.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {initiative.phase}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                              {initiative.phase_progress}% complete
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost">View →</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
