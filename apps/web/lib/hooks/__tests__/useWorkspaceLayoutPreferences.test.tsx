import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWorkspaceLayoutPreferences } from '../useWorkspaceLayoutPreferences';

describe('useWorkspaceLayoutPreferences', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => localStorageMock[key] ?? null,
      setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        localStorageMock = {};
      },
    });

    // Mock window.location.reload
    vi.stubGlobal('location', {
      reload: vi.fn(),
    });

    // Use fake timers for debounce testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('Initial Load', () => {
    it('should load default preferences when localStorage is empty', () => {
      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      expect(result.current.leftCollapsed).toBe(false);
      expect(result.current.rightCollapsed).toBe(false);
    });

    it('should load preferences from localStorage when available', () => {
      localStorageMock['workspace-collapse-state'] = JSON.stringify({
        version: 1,
        leftCollapsed: true,
        rightCollapsed: false,
      });

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      expect(result.current.leftCollapsed).toBe(true);
      expect(result.current.rightCollapsed).toBe(false);
    });

    it('should fall back to defaults when localStorage data is corrupted', () => {
      localStorageMock['workspace-collapse-state'] = 'invalid-json{';
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      expect(result.current.leftCollapsed).toBe(false);
      expect(result.current.rightCollapsed).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load workspace preferences:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should fall back to defaults when version is invalid', () => {
      localStorageMock['workspace-collapse-state'] = JSON.stringify({
        version: 2, // Invalid version
        leftCollapsed: true,
        rightCollapsed: true,
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      expect(result.current.leftCollapsed).toBe(false);
      expect(result.current.rightCollapsed).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid workspace preferences schema, using defaults'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should fall back to defaults when schema is invalid', () => {
      localStorageMock['workspace-collapse-state'] = JSON.stringify({
        version: 1,
        leftCollapsed: 'not-a-boolean', // Invalid type
        rightCollapsed: false,
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      expect(result.current.leftCollapsed).toBe(false);
      expect(result.current.rightCollapsed).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Invalid workspace preferences schema, using defaults'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Save Preferences (Debounced)', () => {
    it('should save left collapse state to localStorage with 500ms debounce', () => {
      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.updateLeftCollapsed(true);
      });

      // Should not save immediately
      expect(localStorageMock['workspace-collapse-state']).toBeUndefined();

      // Advance timers by 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should save after debounce
      expect(localStorageMock['workspace-collapse-state']).toBeDefined();
      const stored = JSON.parse(localStorageMock['workspace-collapse-state']);
      expect(stored.leftCollapsed).toBe(true);
      expect(stored.rightCollapsed).toBe(false);
      expect(stored.version).toBe(1);
    });

    it('should save right collapse state to localStorage with 500ms debounce', () => {
      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.updateRightCollapsed(true);
      });

      // Should not save immediately
      expect(localStorageMock['workspace-collapse-state']).toBeUndefined();

      // Advance timers by 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should save after debounce
      expect(localStorageMock['workspace-collapse-state']).toBeDefined();
      const stored = JSON.parse(localStorageMock['workspace-collapse-state']);
      expect(stored.leftCollapsed).toBe(false);
      expect(stored.rightCollapsed).toBe(true);
      expect(stored.version).toBe(1);
    });

    it('should debounce multiple rapid state changes', () => {
      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      // Rapid changes
      act(() => {
        result.current.updateLeftCollapsed(true);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      act(() => {
        result.current.updateLeftCollapsed(false);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
      act(() => {
        result.current.updateLeftCollapsed(true);
      });

      // Should not save yet
      expect(localStorageMock['workspace-collapse-state']).toBeUndefined();

      // Advance by final 500ms
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should save only the final state
      expect(localStorageMock['workspace-collapse-state']).toBeDefined();
      const stored = JSON.parse(localStorageMock['workspace-collapse-state']);
      expect(stored.leftCollapsed).toBe(true);
    });

    it('should handle localStorage write errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.setItem to throw error
      vi.stubGlobal('localStorage', {
        ...localStorage,
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
      });

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.updateLeftCollapsed(true);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save workspace preferences:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Reset Layout', () => {
    it('should clear localStorage and reset state to defaults', () => {
      localStorageMock['workspace-collapse-state'] = JSON.stringify({
        version: 1,
        leftCollapsed: true,
        rightCollapsed: true,
      });
      localStorageMock['react-resizable-panels:workspace-layout'] = '{"sizes":[20,50,30]}';

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.resetLayout();
      });

      expect(localStorageMock['workspace-collapse-state']).toBeUndefined();
      expect(localStorageMock['react-resizable-panels:workspace-layout']).toBeUndefined();
      expect(result.current.leftCollapsed).toBe(false);
      expect(result.current.rightCollapsed).toBe(false);
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should handle reset errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.removeItem to throw error
      vi.stubGlobal('localStorage', {
        ...localStorage,
        removeItem: () => {
          throw new Error('Storage access denied');
        },
      });

      const { result } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.resetLayout();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to reset workspace layout:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup debounce timeout on unmount', () => {
      const { result, unmount } = renderHook(() => useWorkspaceLayoutPreferences());

      act(() => {
        result.current.updateLeftCollapsed(true);
      });

      // Unmount before debounce completes
      unmount();

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should not have saved (timeout was cleared)
      expect(localStorageMock['workspace-collapse-state']).toBeUndefined();
    });
  });
});
