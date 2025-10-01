import { useState, useRef, useCallback, useEffect } from 'react';
import { TextEntry } from '@shared/schema';
import { TextEntryComponent } from './TextEntryComponent';
import { TextInputModal } from './TextInputModal';
import { MapElements } from './MapElements';

interface InfiniteCanvasProps {
  textEntries: TextEntry[];
  onAddText: (x: number, y: number, content: string) => void;
}

export function InfiniteCanvas({ textEntries, onAddText }: InfiniteCanvasProps) {
  // Calculate initial offset to show some existing content to new users
  const getInitialOffset = () => {
    if (textEntries.length === 0) return { x: 0, y: 0 };
    
    // Find the average position of existing text entries
    const avgX = textEntries.reduce((sum, entry) => sum + entry.x, 0) / textEntries.length;
    const avgY = textEntries.reduce((sum, entry) => sum + entry.y, 0) / textEntries.length;
    
    // Offset slightly from the center of content (show content but not too far)
    const offsetX = Math.max(-200, Math.min(200, -avgX * 0.3));
    const offsetY = Math.max(-200, Math.min(200, -avgY * 0.3));
    
    return { x: offsetX, y: offsetY };
  };

  const [canvasOffset, setCanvasOffset] = useState(getInitialOffset());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });
  const [gotoCoords, setGotoCoords] = useState('');
  const [showGoto, setShowGoto] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [showMapElements, setShowMapElements] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [lastClickPosition, setLastClickPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [hasZoomedOut, setHasZoomedOut] = useState(false);
  const [showZoomWarning, setShowZoomWarning] = useState(false);
  const [showZoomConfirmation, setShowZoomConfirmation] = useState(false);
  const [pendingZoomOut, setPendingZoomOut] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate raw pixel delta (no zoom compensation needed for smooth movement)
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Apply movement directly for natural feeling
    setCanvasOffset(prev => ({
      x: prev.x + deltaX / zoom,
      y: prev.y + deltaY / zoom
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleMouseMoveOnCanvas = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Update cursor position for custom cursor
    setCursorPosition({ x: e.clientX, y: e.clientY });

    // Calculate position relative to canvas center (0,0) with zoom factor
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const x = Math.round(relX / zoom - canvasOffset.x);
    const y = Math.round(relY / zoom - canvasOffset.y);
    
    setCurrentCoords({ x, y });
  }, [canvasOffset, zoom]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    
    // Store click position for map elements (account for zoom)
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const x = Math.round(relX / zoom - canvasOffset.x);
      const y = Math.round(relY / zoom - canvasOffset.y);
      setLastClickPosition({ x, y });
    }
  }, [isDragging, canvasOffset, zoom]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate position relative to canvas center (0,0) with zoom factor
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const x = Math.round(relX / zoom - canvasOffset.x);
    const y = Math.round(relY / zoom - canvasOffset.y);
    
    // Store the exact coordinates where right-click happened
    setModalPosition({ x, y });
    setShowModal(true);
  }, [isDragging, canvasOffset, zoom]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setIsTouchDragging(false);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Start dragging if moved more than 3px (better responsiveness)
    if (!isTouchDragging && (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3)) {
      setIsTouchDragging(true);
    }
    
    if (isTouchDragging) {
      e.preventDefault();
      // Natural movement for touch
      setCanvasOffset(prev => ({
        x: prev.x + deltaX / zoom,
        y: prev.y + deltaY / zoom
      }));
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, [touchStart, isTouchDragging, zoom]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isTouchDragging) {
      setIsTouchDragging(false);
      setTouchStart(null);
      return;
    }
    
    if (isDragging) return;
    
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    // Store touch position for map elements on single tap (account for zoom)
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const touch = e.changedTouches[0];
      const relX = touch.clientX - rect.left - rect.width / 2;
      const relY = touch.clientY - rect.top - rect.height / 2;
      const x = Math.round(relX / zoom - canvasOffset.x);
      const y = Math.round(relY / zoom - canvasOffset.y);
      setLastClickPosition({ x, y });
    }
    
    // Double tap detection (within 300ms)
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const touch = e.changedTouches[0];
      // Calculate position relative to canvas center (0,0) with zoom factor
      const relX = touch.clientX - rect.left - rect.width / 2;
      const relY = touch.clientY - rect.top - rect.height / 2;
      const x = Math.round(relX / zoom - canvasOffset.x);
      const y = Math.round(relY / zoom - canvasOffset.y);
      
      setModalPosition({ x, y });
      setShowModal(true);
    }
    
    setLastTap(currentTime);
    setTouchStart(null);
    setIsTouchDragging(false);
  }, [isDragging, canvasOffset, lastTap, isTouchDragging, zoom]);

  const handleAddText = useCallback((content: string) => {
    onAddText(modalPosition.x, modalPosition.y, content);
    setShowModal(false);
  }, [modalPosition, onAddText]);

  const handleGoto = useCallback(() => {
    const coords = gotoCoords.split(',').map(c => c.trim());
    if (coords.length === 2) {
      const x = parseInt(coords[0]);
      const y = parseInt(coords[1]);
      if (!isNaN(x) && !isNaN(y)) {
        // Since our coordinate system has (0,0) at center and canvas content
        // is positioned relative to that center, we need to move the canvas
        // by the negative of the target coordinates to center them
        setCanvasOffset({ x: -x, y: -y });
        setGotoCoords('');
        setShowGoto(false);
      }
    }
  }, [gotoCoords]);

  const handleGotoKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoto();
    } else if (e.key === 'Escape') {
      setShowGoto(false);
      setGotoCoords('');
    }
  }, [handleGoto]);

  const handleSelectMapElement = useCallback((content: string) => {
    // Place the selected element at the last clicked position
    onAddText(lastClickPosition.x, lastClickPosition.y, content);
    setShowMapElements(false);
  }, [lastClickPosition, onAddText]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Block browser's default Ctrl+scroll zoom
    if (e.ctrlKey) {
      e.stopPropagation();
      return;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const zoomFactor = 1.1;
    const oldZoom = zoom;
    const newZoom = e.deltaY > 0 
      ? Math.max(0.1, zoom / zoomFactor)
      : Math.min(3, zoom * zoomFactor);
    
    if (oldZoom === newZoom) return; // No zoom change
    
    // Check if user is zooming out for the first time below 100%
    if (!hasZoomedOut && newZoom < 1 && oldZoom >= 1) {
      // Show confirmation modal instead of directly zooming out
      setPendingZoomOut(newZoom);
      setShowZoomConfirmation(true);
      return; // Don't proceed with zoom until confirmed
    }
    
    // Calculate cursor position relative to canvas center
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;
    
    // Calculate the world coordinate under the cursor before zoom
    const worldX = cursorX / oldZoom - canvasOffset.x;
    const worldY = cursorY / oldZoom - canvasOffset.y;
    
    // After zoom, we want the same world coordinate to be under the cursor
    // newCursorX = (worldX + newOffset.x) * newZoom
    // So: newOffset.x = cursorX / newZoom - worldX
    setCanvasOffset({
      x: cursorX / newZoom - worldX,
      y: cursorY / newZoom - worldY
    });
    
    setZoom(newZoom);
  }, [zoom, canvasOffset, hasZoomedOut]);

  const handleZoomOutConfirm = useCallback(() => {
    if (pendingZoomOut !== null) {
      setZoom(pendingZoomOut);
      setHasZoomedOut(true);
      setShowZoomConfirmation(false);
      setPendingZoomOut(null);
    }
  }, [pendingZoomOut]);

  const handleZoomOutCancel = useCallback(() => {
    setShowZoomConfirmation(false);
    setPendingZoomOut(null);
  }, []);

  

  const handleMouseEnter = useCallback(() => {
    setShowCustomCursor(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowCustomCursor(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Block browser's default Ctrl+scroll zoom globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Update canvas position when textEntries change (for new users)
  useEffect(() => {
    // Only update if canvas hasn't been moved manually
    if (canvasOffset.x === 0 && canvasOffset.y === 0 && textEntries.length > 0) {
      const newOffset = getInitialOffset();
      setCanvasOffset(newOffset);
    }
  }, [textEntries.length]);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 overflow-hidden select-none custom-cursor"
      style={{ 
        backgroundColor: '#fefefe',
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0),
          linear-gradient(45deg, rgba(0,0,0,0.005) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(0,0,0,0.005) 25%, transparent 25%)
        `,
        backgroundSize: '20px 20px, 40px 40px, 40px 40px'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveOnCanvas}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCanvasClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      data-testid="infinite-canvas"
    >
      {/* Canvas content container */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Center reference point */}
        <div 
          className="absolute" 
          style={{ 
            left: '50%', 
            top: '50%',
            transform: 'translate(-50%, -50%)' 
          }}
        >
          {/* Text entries */}
          {textEntries.map((entry) => (
            <TextEntryComponent
              key={entry.id}
              entry={entry}
            />
          ))}
        </div>
      </div>

      {/* Center crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="relative w-4 h-4">
          <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-400 transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Center crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="relative w-4 h-4">
          <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-400 transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Current coordinates and zoom display */}
      <div className="fixed top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-md text-sm font-mono pointer-events-none">
        x: {Math.round(-canvasOffset.x)}, y: {Math.round(-canvasOffset.y)} | Zoom: {(zoom * 100).toFixed(0)}%
      </div>

      {/* Zoom controls */}
      <div className="fixed top-4 right-20 flex gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="bg-black/80 text-white px-3 py-2 rounded-md text-sm hover:bg-black/90 transition-colors"
        >
          🔍+
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.1, prev / 1.2))}
          className="bg-black/80 text-white px-3 py-2 rounded-md text-sm hover:bg-black/90 transition-colors"
        >
          🔍-
        </button>
        <button
          onClick={() => setZoom(1)}
          className="bg-black/80 text-white px-3 py-2 rounded-md text-sm hover:bg-black/90 transition-colors"
        >
          Reset
        </button>
      </div>

      

      {/* Map Elements button */}
      <button
        onClick={() => setShowMapElements(!showMapElements)}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors shadow-lg z-50"
      >
        🗺️ Map Elements
      </button>

      {/* Go To button */}
      <button
        onClick={() => setShowGoto(!showGoto)}
        className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-md text-sm hover:bg-black/90 transition-colors"
      >
        Go To
      </button>

      {/* Go To input */}
      {showGoto && (
        <div className="fixed top-20 right-4 bg-white border rounded-md shadow-lg p-3">
          <input
            type="text"
            value={gotoCoords}
            onChange={(e) => setGotoCoords(e.target.value)}
            onKeyDown={handleGotoKeyDown}
            placeholder="x, y (e.g. 100, -50)"
            className="w-48 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleGoto}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Go
            </button>
            <button
              onClick={() => { setShowGoto(false); setGotoCoords(''); }}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Zoom Out Confirmation Modal */}
      {showZoomConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">⚠️ Warning!</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Some functions may not display correctly when zoomed out. Do you really want to zoom out?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleZoomOutCancel}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleZoomOutConfirm}
                className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Yes, Zoom Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Text input modal */}
      {showModal && (
        <TextInputModal
          onSubmit={handleAddText}
          onCancel={() => setShowModal(false)}
          position={modalPosition}
          canvasOffset={canvasOffset}
          zoom={zoom}
        />
      )}

      {/* Map Elements Panel */}
      <MapElements
        onSelectElement={handleSelectMapElement}
        isVisible={showMapElements}
        onToggle={() => setShowMapElements(!showMapElements)}
      />

      {/* Custom Cursor */}
      {showCustomCursor && (
        <>
          <div
            className="cursor-crosshair"
            style={{
              left: cursorPosition.x - 10,
              top: cursorPosition.y - 10,
            }}
          />
          <div
            className={`cursor-pointer ${isDragging ? 'dragging' : ''}`}
            style={{
              left: cursorPosition.x - 12,
              top: cursorPosition.y - 12,
            }}
          />
        </>
      )}
    </div>
  );
}
