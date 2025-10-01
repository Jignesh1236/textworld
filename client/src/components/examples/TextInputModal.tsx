import { TextInputModal } from '../TextInputModal';

export default function TextInputModalExample() {
  const handleSubmit = (content: string) => {
    console.log('Text submitted:', content);
  };

  const handleCancel = () => {
    console.log('Modal cancelled');
  };

  return (
    <div className="relative w-full h-96 bg-gray-100">
      <TextInputModal
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        position={{ x: 0, y: 0 }}
        canvasOffset={{ x: 0, y: 0 }}
      />
    </div>
  );
}