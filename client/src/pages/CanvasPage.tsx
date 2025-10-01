import { useQuery, useMutation } from '@tanstack/react-query';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { TextEntry } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function CanvasPage() {
  // Fetch all text entries
  const { data: textEntries = [], isLoading } = useQuery<TextEntry[]>({
    queryKey: ['/api/text-entries'],
  });

  // Mutation to add new text
  const addTextMutation = useMutation({
    mutationFn: (data: { x: number; y: number; content: string }) =>
      apiRequest('POST', '/api/text-entries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/text-entries'] });
    },
  });

  const handleAddText = (x: number, y: number, content: string) => {
    addTextMutation.mutate({ x, y, content });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-muted-foreground">Loading canvas...</div>
      </div>
    );
  }

  return (
    <InfiniteCanvas
      textEntries={textEntries}
      onAddText={handleAddText}
    />
  );
}