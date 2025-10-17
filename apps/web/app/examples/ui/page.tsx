'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function UIExamplesPage(): React.ReactElement {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">shadcn/ui Component Examples</h1>
        <p className="text-muted-foreground">
          Explore all the installed UI components with interactive examples
        </p>
      </div>

      <Separator />

      {/* Button Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Button Component</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Sizes</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Icon button">
                ★
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">States</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Enabled</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Card Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Card Component</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>A basic card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area where you can put any content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>Includes all card sections</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content goes here with additional information.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Dialog Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dialog Component</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. It provides additional context about the dialog purpose.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Dialog content goes here. You can add forms, text, or any other content.</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      {/* Input and Label Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Input & Label Components</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Form Example</CardTitle>
            <CardDescription>Input fields with labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue && (
                <p className="text-sm text-muted-foreground">
                  You typed: {inputValue}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled Input</Label>
              <Input id="disabled" disabled placeholder="This input is disabled" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </Card>
      </section>

      <Separator />

      {/* Tabs Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tabs Component</h2>
        <Tabs defaultValue="account" className="max-w-2xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@johndoe" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your application settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Settings content would go here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Separator Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Separator Component</h2>
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Horizontal Separator</h3>
                <p className="text-sm text-muted-foreground">Default orientation</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm">Content after separator</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
