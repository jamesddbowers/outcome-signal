'use client';

import React, { useRef, useState, ElementRef } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose, Menu } from 'lucide-react';
import LeftPanel from './LeftPanel';
import MiddlePanel from './MiddlePanel';
import RightPanel from './RightPanel';

interface WorkspaceShellProps {
  initiativeId: string;
}

type PanelRef = ElementRef<typeof Panel>;

export default function WorkspaceShell({ initiativeId }: WorkspaceShellProps): JSX.Element {
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
    <>
      {/* Desktop Layout (≥1024px) */}
      <div className="hidden lg:block h-screen w-full">
        <PanelGroup
          direction="horizontal"
          className="h-full"
          autoSaveId="workspace-layout-v1"
        >
          {/* Left Panel */}
          <Panel
            ref={leftPanelRef}
            id="left"
            defaultSize={20}
            minSize={15}
            collapsible
            collapsedSize={4}
            className="relative"
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
                <div className="writing-mode-vertical text-sm font-semibold text-muted-foreground whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                  Hierarchy
                </div>
              </div>
            ) : (
              <>
                <LeftPanel initiativeId={initiativeId} />
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

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/10 transition-colors" />

          {/* Middle Panel */}
          <Panel id="middle" defaultSize={50} minSize={30}>
            <MiddlePanel initiativeId={initiativeId} />
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
                <div className="writing-mode-vertical text-sm font-semibold text-muted-foreground whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                  Agent Chat
                </div>
              </div>
            ) : (
              <>
                <RightPanel initiativeId={initiativeId} />
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

      {/* Tablet Layout (768px-1023px) */}
      <div className="hidden md:block lg:hidden h-screen w-full">
        <div className="h-full flex flex-col">
          {/* Hamburger Menu for Left Panel */}
          <div className="p-2 border-b">
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Open hierarchy menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <LeftPanel initiativeId={initiativeId} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Middle and Right Panels */}
          <div className="flex-1">
            <PanelGroup
              direction="horizontal"
              className="h-full"
              autoSaveId="workspace-layout-tablet-v1"
            >
              <Panel id="middle-tablet" defaultSize={60} minSize={40}>
                <MiddlePanel initiativeId={initiativeId} />
              </Panel>

              <PanelResizeHandle className="w-1 bg-border hover:bg-primary/10 transition-colors" />

              <Panel id="right-tablet" defaultSize={40} minSize={30}>
                <RightPanel initiativeId={initiativeId} />
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>

      {/* Mobile Layout (<768px) */}
      <div className="block md:hidden h-screen w-full">
        <Tabs defaultValue="document" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none h-12">
            <TabsTrigger value="hierarchy" className="h-11">Hierarchy</TabsTrigger>
            <TabsTrigger value="document" className="h-11">Document</TabsTrigger>
            <TabsTrigger value="chat" className="h-11">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="hierarchy" className="flex-1 mt-0">
            <LeftPanel initiativeId={initiativeId} />
          </TabsContent>
          <TabsContent value="document" className="flex-1 mt-0">
            <MiddlePanel initiativeId={initiativeId} />
          </TabsContent>
          <TabsContent value="chat" className="flex-1 mt-0">
            <RightPanel initiativeId={initiativeId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
