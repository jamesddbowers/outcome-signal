'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWorkspaceLayoutPreferences } from '@/lib/hooks/useWorkspaceLayoutPreferences';

/**
 * Settings page for application configuration.
 * Currently includes workspace layout reset functionality.
 */
export default function SettingsPage(): JSX.Element {
  const { resetLayout } = useWorkspaceLayoutPreferences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReset = (): void => {
    resetLayout();
    setIsDialogOpen(false);
    // Note: resetLayout() triggers page reload, so toast won't be visible
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Workspace Layout</h2>
        <p className="text-muted-foreground">
          Reset your workspace layout to default column widths and collapse states.
          This will restore the default panel widths and expand all collapsed panels.
        </p>

        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Reset Workspace Layout
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Workspace Layout?</DialogTitle>
              <DialogDescription>
                This will restore the default column widths and expand all panels.
                The page will reload to apply the changes. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
