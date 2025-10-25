"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useInitiatives } from "@/lib/hooks/useInitiatives";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { CreateInitiativeButton } from "@/components/hierarchy/CreateInitiativeButton";
import { useRouter } from "next/navigation";

export default function Dashboard(): JSX.Element {
  const { user, isLoaded } = useUser();
  const { data: initiatives, isLoading: initiativesLoading, refetch } = useInitiatives();
  const router = useRouter();

  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState("");

  const handleCreateClick = (): void => {
    setIsCreateDialogOpen(true);
    setCreateError("");
  };

  const handleCreateInitiative = async (): Promise<void> => {
    if (!title.trim()) {
      setCreateError("Title is required");
      return;
    }

    setIsCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.error === "INITIATIVE_LIMIT_REACHED") {
          setCreateError(data.message);
        } else {
          setCreateError(data.message || "Failed to create initiative");
        }
        return;
      }

      // Success - close dialog and navigate to new initiative
      setIsCreateDialogOpen(false);
      setTitle("");
      setDescription("");

      // Refresh initiatives list
      await refetch();

      // Navigate to the new initiative
      router.push(`/dashboard/initiatives/${data.initiative.id}`);
    } catch (error) {
      console.error("Error creating initiative:", error);
      setCreateError("An unexpected error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDialogClose = (): void => {
    if (!isCreating) {
      setIsCreateDialogOpen(false);
      setTitle("");
      setDescription("");
      setCreateError("");
    }
  };

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
    <>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Your Initiatives</CardTitle>
            {initiatives && initiatives.length > 0 && (
              <CreateInitiativeButton onClick={handleCreateClick} size="sm" />
            )}
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
                  No initiatives yet. Create your first initiative to get started!
                </p>
                <CreateInitiativeButton onClick={handleCreateClick} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Initiative Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Initiative</DialogTitle>
            <DialogDescription>
              Define a new initiative to track your project outcomes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter initiative title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter initiative description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreating}
                rows={4}
                maxLength={1000}
              />
            </div>

            {createError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {createError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInitiative}
              disabled={isCreating || !title.trim()}
            >
              {isCreating ? "Creating..." : "Create Initiative"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
