import { TextEntry } from '@shared/schema';

interface TextEntryComponentProps {
  entry: TextEntry;
}

export function TextEntryComponent({ entry }: TextEntryComponentProps) {
  return (
    <div
      className="absolute whitespace-nowrap pointer-events-none select-none"
      style={{
        left: `${entry.x}px`,
        top: `${entry.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      data-testid={`text-entry-${entry.id}`}
    >
      <div className="flex flex-col items-center">
        <div className="text-foreground text-base text-center whitespace-pre max-w-none">
          {entry.content}
        </div>
        <span className="text-xs text-gray-400 mt-1">
          ({entry.x}, {entry.y})
        </span>
      </div>
    </div>
  );
}