'use client';

import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export interface TipTapEditorProps {
  content: string;
  className?: string;
}

export interface TipTapEditorRef {
  scrollToSection: (sectionId: string) => void;
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  ({ content, className = '' }, ref) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          codeBlock: {},
          blockquote: {},
        }),
        Markdown,
      ],
      content,
      editable: false,
      // Don't render immediately on the server to avoid SSR issues
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert focus:outline-none',
          role: 'document',
          'aria-label': 'Document preview',
          'aria-readonly': 'true',
        },
      },
      // Performance optimizations for read-only mode
      enableInputRules: false,
      enablePasteRules: false,
    });

    // Update editor content when prop changes
    useEffect(() => {
      if (editor && content) {
        // Set content as markdown
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    // Expose scrollToSection method via ref
    useImperativeHandle(ref, () => ({
      scrollToSection: (sectionId: string) => {
        const element = editorContainerRef.current?.querySelector(
          `#${sectionId}`
        );
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
    }));

    return (
      <div
        ref={editorContainerRef}
        className={`h-full overflow-y-auto p-6 ${className}`}
        data-testid="tiptap-editor-container"
      >
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TipTapEditor.displayName = 'TipTapEditor';

export default TipTapEditor;
