'use client';
import { useState, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import TensorFlow.js and the MobileNet model
import * as mobilenet from '@tensorflow-models/mobilenet';

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
        {/* Camera Icon */}
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 012-2h3a1 1 0 01.9.55L10.618 5H14a2 2 0 012 2v5a1 1 0 002 0V7a4 4 0 00-4-4h-3.382l-.723-1.447A1 1 0 008 1H6a4 4 0 00-4 4v7a1 1 0 002 0V5z" /><path d="M11 16a4 4 0 10-8 0 4 4 0 008 0zM7 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
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