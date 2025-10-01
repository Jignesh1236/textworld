import { TextEntryComponent } from '../TextEntryComponent';

export default function TextEntryComponentExample() {
  const mockEntry = {
    id: 'example-1',
    content: 'Hello World!',
    x: 100,
    y: 200,
    createdAt: new Date(),
  };

  return (
    <div className="relative w-96 h-64 bg-white border">
      <TextEntryComponent entry={mockEntry} />
    </div>
  );
}