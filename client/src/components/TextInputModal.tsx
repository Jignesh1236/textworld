import { useState, useEffect, useRef } from 'react';

interface TextInputModalProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  position: { x: number; y: number };
  canvasOffset: { x: number; y: number };
  zoom: number;
}

export function TextInputModal({ onSubmit, onCancel, position, canvasOffset, zoom }: TextInputModalProps) {
  const [content, setContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Calculate screen position for modal: screen = center + (canvasOffset + world) * zoom
  const screenX = window.innerWidth / 2 + (canvasOffset.x + position.x) * zoom;
  const screenY = window.innerHeight / 2 + (canvasOffset.y + position.y) * zoom;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        onSubmit(content.trim());
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/20"
      onClick={handleBackdropClick}
      data-testid="text-input-modal"
    >
      <div
        className="absolute bg-white rounded-md shadow-lg border p-4 min-w-64"
        style={{
          left: Math.max(10, Math.min(window.innerWidth - 270, screenX - 128)),
          top: Math.max(10, Math.min(window.innerHeight - 100, screenY - 25)),
        }}
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your text... (Enter to submit, Shift+Enter for new line)"
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={4}
            data-testid="input-text"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              data-testid="button-submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}