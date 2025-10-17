import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open Dialog');
    await user.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  it('renders dialog with description', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>This is a description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('dialog is initially closed', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Hidden Content</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });
});
