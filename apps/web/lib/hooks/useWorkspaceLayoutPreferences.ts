import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'workspace-collapse-state';
const PANEL_WIDTHS_KEY = 'react-resizable-panels:workspace-layout';

interface WorkspaceLayoutPreferences {
  version: 1;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
}

const DEFAULT_PREFERENCES: WorkspaceLayoutPreferences = {
  version: 1,
  leftCollapsed: false,
  rightCollapsed: false,
};

interface UseWorkspaceLayoutPreferencesReturn {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  updateLeftCollapsed: (collapsed: boolean) => void;
  updateRightCollapsed: (collapsed: boolean) => void;
  resetLayout: () => void;
}

/**
 * Custom hook to manage workspace layout preferences with localStorage persistence.
 * Handles collapse state for left and right panels with debounced saves.
 *
 * @returns Layout state and control functions
 */
export function useWorkspaceLayoutPreferences(): UseWorkspaceLayoutPreferencesReturn {
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(DEFAULT_PREFERENCES.leftCollapsed);
  const [rightCollapsed, setRightCollapsed] = useState<boolean>(DEFAULT_PREFERENCES.rightCollapsed);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<WorkspaceLayoutPreferences>;

        // Validate schema and version
        if (parsed.version === 1 &&
            typeof parsed.leftCollapsed === 'boolean' &&
            typeof parsed.rightCollapsed === 'boolean') {
          setLeftCollapsed(parsed.leftCollapsed);
          setRightCollapsed(parsed.rightCollapsed);
        } else {
          console.warn('Invalid workspace preferences schema, using defaults');
        }
      }
    } catch (error) {
      console.error('Failed to load workspace preferences:', error);
      // Fall back to defaults (already set in initial state)
    }
  }, []);

  // Debounced save to localStorage (500ms delay)
  const savePreferences = useCallback((left: boolean, right: boolean): void => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const preferences: WorkspaceLayoutPreferences = {
          version: 1,
          leftCollapsed: left,
          rightCollapsed: right,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save workspace preferences:', error);
      }
    }, 500);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Update left panel collapse state
  const updateLeftCollapsed = useCallback((collapsed: boolean): void => {
    setLeftCollapsed(collapsed);
    savePreferences(collapsed, rightCollapsed);
  }, [rightCollapsed, savePreferences]);

  // Update right panel collapse state
  const updateRightCollapsed = useCallback((collapsed: boolean): void => {
    setRightCollapsed(collapsed);
    savePreferences(leftCollapsed, collapsed);
  }, [leftCollapsed, savePreferences]);

  // Reset layout to defaults
  const resetLayout = useCallback((): void => {
    try {
      // Clear both localStorage keys
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PANEL_WIDTHS_KEY);

      // Reset state to defaults
      setLeftCollapsed(DEFAULT_PREFERENCES.leftCollapsed);
      setRightCollapsed(DEFAULT_PREFERENCES.rightCollapsed);

      // Reload page to reset panel widths (required for react-resizable-panels)
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset workspace layout:', error);
    }
  }, []);

  return {
    leftCollapsed,
    rightCollapsed,
    updateLeftCollapsed,
    updateRightCollapsed,
    resetLayout,
  };
}
