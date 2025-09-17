import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddPhotosProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function AddPhotos({ photos, onPhotosChange, maxPhotos = 6 }: AddPhotosProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    const remainingSlots = maxPhotos - photos.length;
    if (files.length > remainingSlots) {
      toast({
        title: "Too many photos",
        description: `You can only upload ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'}.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const uploadedUrls: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', 'profile-photos');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to upload ${file.name}: ${error}`);
        }

        const result = await response.json();
        uploadedUrls.push(result.url);
        
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      onPhotosChange([...photos, ...uploadedUrls]);
      
      toast({
        title: "Photos uploaded successfully!",
        description: `${uploadedUrls.length} photo${uploadedUrls.length === 1 ? '' : 's'} added to your profile.`,
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      uploadFiles(files);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    
    toast({
      title: "Photo removed",
      description: "Photo has been removed from your profile.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Add photos to show your personality. You can upload up to {maxPhotos} photos.
        </p>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading photos...</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={photo}
              alt={`Profile photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              data-testid={`img-uploaded-photo-${index}`}
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`button-remove-photo-${index}`}
            >
              <X className="w-3 h-3" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </div>
        ))}
        
        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <div className="aspect-square">
            <Button
              variant="outline"
              className="w-full h-full border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center space-y-2"
              onClick={triggerFileInput}
              disabled={uploading}
              data-testid="button-add-photo"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Photo</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {photos.length === 0 && (
        <Button
          onClick={triggerFileInput}
          disabled={uploading}
          className="w-full"
          data-testid="button-upload-photos"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Choose Photos
            </>
          )}
        </Button>
      )}

      {/* Photo Count */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {photos.length} of {maxPhotos} photos added
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-photos"
      />
    </div>
  );
}