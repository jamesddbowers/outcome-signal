'use client';

import { Suspense } from 'react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import { Card } from '@/components/ui/card';

interface WorkspacePageProps {
  params: {
    initiativeId: string;
  };
}

function LoadingState(): JSX.Element {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </Card>
    </div>
  );
}

export default function WorkspacePage({ params }: WorkspacePageProps): JSX.Element {
  return (
    <Suspense fallback={<LoadingState />}>
      <WorkspaceShell initiativeId={params.initiativeId} />
    </Suspense>
  );
}
