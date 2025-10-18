/**
 * Epic Detail Page
 *
 * Displays the workspace view for a specific Epic within an Initiative.
 * Uses the same three-column layout as the Initiative page but with Epic context.
 */

'use client';

import { use } from 'react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

interface EpicDetailPageProps {
  params: Promise<{
    initiativeId: string;
    epicId: string;
  }>;
}

export default function EpicDetailPage({ params }: EpicDetailPageProps): JSX.Element {
  const { initiativeId, epicId } = use(params);

  return <WorkspaceShell initiativeId={initiativeId} epicId={epicId} />;
}
