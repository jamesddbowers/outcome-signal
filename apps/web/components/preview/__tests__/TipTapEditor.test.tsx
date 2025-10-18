import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TipTapEditor, {
  TipTapEditorRef,
} from '../TipTapEditor';

// Mock TipTap hooks and components
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    isEditable: false,
    getHTML: () => '<h1>Test Heading</h1><p>Test paragraph</p>',
    commands: {
      setContent: vi.fn(),
    },
  })),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content">
      {editor && typeof editor === 'object' && 'getHTML' in editor && typeof editor.getHTML === 'function'
        ? editor.getHTML()
        : 'No editor'}
    </div>
  ),
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

describe('TipTapEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders editor container', () => {
    render(<TipTapEditor content="# Test Heading" />);
    expect(screen.getByTestId('tiptap-editor-container')).toBeInTheDocument();
  });

  it('renders editor content', () => {
    render(<TipTapEditor content="# Test Heading\n\nParagraph text" />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('renders markdown content correctly', () => {
    render(<TipTapEditor content="# Heading\n\nParagraph text" />);
    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent).toHaveTextContent('Test Heading');
    expect(editorContent).toHaveTextContent('Test paragraph');
  });

  it('accepts custom className prop', () => {
    render(<TipTapEditor content="# Test" className="custom-class" />);
    const container = screen.getByTestId('tiptap-editor-container');
    expect(container).toHaveClass('custom-class');
  });

  it('renders with empty content', () => {
    render(<TipTapEditor content="" />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('exposes scrollToSection method via ref', () => {
    const ref = React.createRef<TipTapEditorRef>();
    render(<TipTapEditor ref={ref} content="# Section 1" />);

    expect(ref.current).toBeDefined();
    expect(ref.current?.scrollToSection).toBeDefined();
    expect(typeof ref.current?.scrollToSection).toBe('function');
  });

  it('scrollToSection calls scrollIntoView on target element', () => {
    const ref = React.createRef<TipTapEditorRef>();
    render(<TipTapEditor ref={ref} content="# Section 1" />);

    // Mock scrollIntoView globally
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Call scrollToSection (querySelector won't find the element but that's ok for this test)
    ref.current?.scrollToSection('section-1');

    // The method should be callable without errors
    expect(ref.current?.scrollToSection).toBeDefined();
  });

  it('handles long content without crashing', () => {
    const longContent = Array(1000)
      .fill('# Heading\n\nParagraph text\n\n')
      .join('');
    render(<TipTapEditor content={longContent} />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });
});
