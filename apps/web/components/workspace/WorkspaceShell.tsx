'use client';

import React, { useRef, useState, ElementRef } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { AppSidebar } from '@/components/hierarchy/AppSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose, Menu } from 'lucide-react';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

interface WorkspaceShellProps {
  initiativeId: string;
  epicId?: string;
}

type PanelRef = ElementRef<typeof Panel>;

export default function WorkspaceShell({ initiativeId, epicId }: WorkspaceShellProps): JSX.Element {
  const leftPanelRef = useRef<PanelRef>(null);
  const rightPanelRef = useRef<PanelRef>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const handleLeftCollapse = (): void => {
    if (leftPanelRef.current) {
      if (isLeftCollapsed) {
        leftPanelRef.current.expand();
      } else {
        leftPanelRef.current.collapse();
      }
    }
  };

  const handleRightCollapse = (): void => {
    if (rightPanelRef.current) {
      if (isRightCollapsed) {
        rightPanelRef.current.expand();
      } else {
        rightPanelRef.current.collapse();
      }
    }
  };

  return (
    <div className="h-screen w-full">
      {/* Mobile Layout: Tabs (<768px) */}
      <div className="md:hidden h-full">
        <Tabs defaultValue="document" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none h-12 flex-shrink-0">
            <TabsTrigger value="hierarchy" className="h-11">Hierarchy</TabsTrigger>
            <TabsTrigger value="document" className="h-11">Document</TabsTrigger>
            <TabsTrigger value="chat" className="h-11">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="hierarchy" className="flex-1 mt-0 overflow-hidden">
            <AppSidebar />
          </TabsContent>
          <TabsContent value="document" className="flex-1 mt-0 overflow-hidden">
            <MiddlePanel initiativeId={initiativeId} epicId={epicId} />
          </TabsContent>
          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
            <RightPanel initiativeId={initiativeId} epicId={epicId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tablet/Desktop Layout: Resizable Panels (≥768px) */}
      <div className="hidden md:flex h-full flex-col">
        {/* Tablet hamburger menu (768px-1023px) */}
        <div className="lg:hidden p-2 border-b flex-shrink-0">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Open hierarchy menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Panel Layout */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup
            direction="horizontal"
            className="h-full"
            autoSaveId="workspace-layout"
          >
            {/* Left Panel - Desktop only (≥1024px) */}
            <Panel
              ref={leftPanelRef}
              id="left"
              defaultSize={20}
              minSize={15}
              collapsible
              collapsedSize={4}
              className="relative hidden lg:block"
              onCollapse={() => setIsLeftCollapsed(true)}
              onExpand={() => setIsLeftCollapsed(false)}
            >
              {isLeftCollapsed ? (
                <div className="h-full w-full bg-muted flex flex-col items-center justify-start pt-4 gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLeftCollapse}
                    className="h-11 w-11"
                    aria-label="Expand left panel"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div
                    className="writing-mode-vertical text-sm font-semibold text-muted-foreground whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    Hierarchy
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-full overflow-hidden flex flex-col">
                    <AppSidebar />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLeftCollapse}
                    className="absolute top-2 right-2 z-10 h-11 w-11"
                    aria-label="Collapse left panel"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </>
              )}
            </Panel>

            {/* Resize Handle - Desktop only */}
            <PanelResizeHandle className="hidden lg:block w-1 bg-border hover:bg-primary/10 transition-colors" />

            {/* Middle Panel */}
            <Panel id="middle" defaultSize={50} minSize={30}>
              <MiddlePanel initiativeId={initiativeId} epicId={epicId} />
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/10 transition-colors" />

            {/* Right Panel */}
            <Panel
              ref={rightPanelRef}
              id="right"
              defaultSize={30}
              minSize={20}
              collapsible
              collapsedSize={4}
              className="relative"
              onCollapse={() => setIsRightCollapsed(true)}
              onExpand={() => setIsRightCollapsed(false)}
            >
              {isRightCollapsed ? (
                <div className="h-full w-full bg-muted flex flex-col items-center justify-start pt-4 gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRightCollapse}
                    className="h-11 w-11"
                    aria-label="Expand right panel"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div
                    className="writing-mode-vertical text-sm font-semibold text-muted-foreground whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    Agent Chat
                  </div>
                </div>
              ) : (
                <>
                  <RightPanel initiativeId={initiativeId} epicId={epicId} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRightCollapse}
                    className="absolute top-2 left-2 z-10 h-11 w-11"
                    aria-label="Collapse right panel"
                  >
                    <PanelRightClose className="h-4 w-4" />
                  </Button>
                </>
              )}
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
