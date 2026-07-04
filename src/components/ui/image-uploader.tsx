
"use client";

import { useState, useCallback, useRef, ChangeEvent } from 'react';
import { UploadCloud, Loader, X } from 'lucide-react';
import { useFirebase } from '@/firebase/client-provider';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onUploadSuccess: (url: string | null) => void;
  initialImageUrl?: string | null;
  folder: string;
  disabled?: boolean;
}

export const ImageUploader = ({
  onUploadSuccess,
  initialImageUrl,
  folder,
  disabled = false,
}: ImageUploaderProps) => {
  const { storage } = useFirebase();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!storage) {
      setError('Firebase Storage is not available.');
      return;
    }

    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please select an image.');
        return;
    }
    
    setUploading(true);
    setError(null);
    
    const tempPreviewUrl = URL.createObjectURL(file);
    setPreview(tempPreviewUrl);

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error('Upload Error:', uploadError);
        setError(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        URL.revokeObjectURL(tempPreviewUrl);
        setPreview(initialImageUrl || null);
        toast({
          title: 'Upload Error',
          description: 'There was a problem uploading your image.',
          variant: 'destructive',
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploading(false);
          setPreview(downloadURL);
          onUploadSuccess(downloadURL);
          URL.revokeObjectURL(tempPreviewUrl);
          toast({ title: 'Upload Successful', description: 'Image has been uploaded.' });
        });
      }
    );
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };
  
  const triggerFileInput = () => {
    if (!disabled && !uploading) {
        inputRef.current?.click();
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUploadSuccess(null);
    if(inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div>
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
            disabled={disabled || uploading}
        />
        <div 
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                !preview && 'cursor-pointer hover:border-primary'} ${
                disabled || uploading ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
        >
            {
                uploading ? (
                    <div className='flex flex-col items-center justify-center space-y-2'>
                        <Loader className='animate-spin h-8 w-8 text-primary' />
                        <p>Uploading... {uploadProgress.toFixed(0)}%</p>
                        <Progress value={uploadProgress} className='w-full' />
                    </div>
                ) : error ? (
                    <div className='flex flex-col items-center justify-center space-y-2 text-destructive'>
                        <X className='h-8 w-8' />
                        <p>Upload Failed</p>
                        <p className='text-xs'>{error}</p>
                        <Button onClick={(e) => { e.stopPropagation(); triggerFileInput(); }} variant='outline' size='sm'>Try Again</Button>
                    </div>
                ) : preview ? (
                    <div className='relative group w-full h-48'>
                        <Image src={preview} alt='Upload preview' layout='fill' objectFit='contain' className='rounded-md' />
                        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                           <div className='flex space-x-2'>
                             <Button size='sm' onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>Change</Button>
                             <Button size='sm' variant='destructive' onClick={(e) => { e.stopPropagation(); removeImage(); }}>Remove</Button>
                           </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center space-y-2 text-gray-500'>
                        <UploadCloud className='h-8 w-8' />
                        <p>Click to select an image</p>
                        <p className='text-xs'>PNG, JPG, GIF up to 10MB</p>
                    </div>
                )
            }
        </div>
    </div>
  );
};
