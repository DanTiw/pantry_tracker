'use client';
import { useState, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CameraIcon } from 'lucide-react';

// Import the camera icon from React Icons

interface AddViaImageComponentProps {
  onItemRecognized: (itemName: string) => void;
}

export default function AddViaImageComponent({ onItemRecognized }: AddViaImageComponentProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProcessingImage(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imgElement = document.createElement('img');
          imgElement.src = reader.result as string;

          imgElement.onload = async () => {
            // Dynamically import TensorFlow.js and MobileNet
            const [tf, mobilenet] = await Promise.all([
              import('@tensorflow/tfjs'),
              import('@tensorflow-models/mobilenet'),
            ]);

            // Load the model
            const model = await mobilenet.load();

            // Classify the image
            const predictions = await model.classify(imgElement);

            if (predictions && predictions.length > 0) {
              const itemName = predictions[0].className;
              onItemRecognized(itemName);
              setIsImageDialogOpen(false);
            } else {
              alert('Could not recognize the item.');
            }
            setProcessingImage(false);
          };
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('An error occurred while processing the image.');
        setProcessingImage(false);
      }
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsImageDialogOpen(true)}
        className="w-full sm:w-auto"
      >
        <CameraIcon className="h-5 w-5 mr-2" />
        Add Item via Image
      </Button>

      {/* Image Capture Dialog */}
      <AlertDialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Capture Image</AlertDialogTitle>
            <AlertDialogDescription>
              Take a picture of the food item to add it to your pantry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageCapture}
              ref={imageInputRef}
              className="file-input"
            />
            {processingImage && <p>Processing image...</p>}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsImageDialogOpen(false)}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}