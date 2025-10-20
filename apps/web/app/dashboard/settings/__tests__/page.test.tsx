import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '../page';

// Mock useWorkspaceLayoutPreferences hook
const mockResetLayout = vi.fn();
vi.mock('@/lib/hooks/useWorkspaceLayoutPreferences', () => ({
  useWorkspaceLayoutPreferences: () => ({
    leftCollapsed: false,
    rightCollapsed: false,
    updateLeftCollapsed: vi.fn(),
    updateRightCollapsed: vi.fn(),
    resetLayout: mockResetLayout,
  }),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render settings page with heading', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /settings/i, level: 1 })).toBeInTheDocument();
  });

  it('should render workspace layout section', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /workspace layout/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/reset your workspace layout/i)).toBeInTheDocument();
  });

  it('should render reset button', () => {
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    expect(resetButton).toBeInTheDocument();
  });

  it('should open confirmation dialog when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    await user.click(resetButton);

    expect(screen.getByText(/reset workspace layout\?/i)).toBeInTheDocument();
    expect(screen.getByText(/this will restore the default column widths/i)).toBeInTheDocument();
  });

  it('should show cancel and reset buttons in dialog', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    await user.click(resetButton);

    expect(screen.getByRole('button', { name: /^cancel$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^reset$/i })).toBeInTheDocument();
  });

  it('should close dialog when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    await user.click(resetButton);

    const cancelButton = screen.getByRole('button', { name: /^cancel$/i });
    await user.click(cancelButton);

    // Dialog should be closed (dialog content not in document)
    expect(screen.queryByText(/reset workspace layout\?/i)).not.toBeInTheDocument();
  });

  it('should call resetLayout when reset is confirmed', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    await user.click(resetButton);

    const confirmButton = screen.getByRole('button', { name: /^reset$/i });
    await user.click(confirmButton);

    expect(mockResetLayout).toHaveBeenCalledTimes(1);
  });

  it('should not call resetLayout when dialog is cancelled', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const resetButton = screen.getByRole('button', { name: /reset workspace layout/i });
    await user.click(resetButton);

    const cancelButton = screen.getByRole('button', { name: /^cancel$/i });
    await user.click(cancelButton);

    expect(mockResetLayout).not.toHaveBeenCalled();
  });
});
