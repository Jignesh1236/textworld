import { InfiniteCanvas } from '../InfiniteCanvas';

export default function InfiniteCanvasExample() {
  const mockTextEntries = [
    {
      id: 'entry-1',
      content: 'Welcome to the canvas!',
      x: 0,
      y: 0,
      createdAt: new Date(),
    },
    {
      id: 'entry-2', 
      content: 'Click anywhere to add text',
      x: 150,
      y: 80,
      createdAt: new Date(),
    },
    {
      id: 'entry-3',
      content: 'Drag to pan around',
      x: -100,
      y: -50,
      createdAt: new Date(),
    },
  ];

  const handleAddText = (x: number, y: number, content: string) => {
    console.log('Add text:', { x, y, content });
  };

  return (
    <InfiniteCanvas
      textEntries={mockTextEntries}
      onAddText={handleAddText}
    />
  );
}