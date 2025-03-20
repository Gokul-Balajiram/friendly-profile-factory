
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ImageCropperProps {
  image: string | null;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  open: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ 
  image, 
  onCrop, 
  onCancel, 
  aspectRatio = 1, 
  open 
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const container = containerRef.current;
    const img = imageRef.current;
    
    if (!container || !img) return;
    
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate new position
    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;
    
    // Calculate bounds
    const scaledWidth = imgRect.width * scale;
    const scaledHeight = imgRect.height * scale;
    
    // Constrain movement
    const minX = containerRect.width - scaledWidth;
    const minY = containerRect.height - scaledHeight;
    
    newX = Math.min(0, Math.max(newX, minX));
    newY = Math.min(0, Math.max(newY, minY));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const cropImage = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    const container = containerRef.current.getBoundingClientRect();
    const img = imageRef.current;
    
    // Set canvas size to container dimensions (cropped size)
    canvas.width = container.width;
    canvas.height = container.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate source position and dimensions
    // Scaling factor = displayed image width / original image width
    const scalingFactor = (img.width * scale) / img.naturalWidth;
    
    // Source positions in the original image
    const sourceX = -position.x / scalingFactor;
    const sourceY = -position.y / scalingFactor;
    const sourceWidth = container.width / scalingFactor;
    const sourceHeight = container.height / scalingFactor;
    
    // Draw only the visible portion of the image to the canvas
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, canvas.width, canvas.height
    );
    
    // Convert canvas to data URL
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCrop(croppedImageUrl);
  };

  useEffect(() => {
    // Reset position and scale when image changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Crop Your Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div 
            ref={containerRef}
            className="w-64 h-64 overflow-hidden rounded-full border-2 border-primary relative"
            style={{ aspectRatio }}
          >
            <div
              className="absolute inset-0 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {image && (
                <img
                  ref={imageRef}
                  src={image}
                  alt="Crop preview"
                  className="max-w-none"
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                    transformOrigin: '0 0',
                    width: '100%',
                    height: 'auto',
                  }}
                  draggable="false"
                />
              )}
            </div>
          </div>
          
          <div className="w-full px-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Zoom:</span>
              <Slider
                value={[scale]}
                min={0.5}
                max={3}
                step={0.01}
                onValueChange={handleScaleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={cropImage}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
