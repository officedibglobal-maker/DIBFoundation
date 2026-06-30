
'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import type { HeroSlide } from '@/types/hero-slide';
import { uploadImage } from '@/lib/firestore/hero-slides';
import { useToast } from '@/hooks/use-toast';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  imageUrl: z.string().trim().min(1, 'Desktop image is required'),
  mobileImageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  isActive: z.boolean(),
});

type HeroSlideFormValues = z.infer<typeof formSchema>;
type HeroSlideSaveData = Omit<HeroSlide, 'id'>;

interface HeroSlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HeroSlideSaveData) => Promise<void>;
  slide: HeroSlide | null;
  isSaving?: boolean;
}

const EMPTY_FORM_VALUES: HeroSlideFormValues = {
  title: '',
  subtitle: '',
  imageUrl: '',
  mobileImageUrl: '',
  imageAlt: '',
  isActive: false,
};

function getSlideFormValues(
  slide: HeroSlide | null
): HeroSlideFormValues {
  if (!slide) {
    return { ...EMPTY_FORM_VALUES };
  }

  return {
    title: slide.title ?? '',
    subtitle: slide.subtitle ?? '',
    imageUrl: slide.imageUrl ?? '',
    mobileImageUrl: slide.mobileImageUrl ?? '',
    imageAlt: slide.imageAlt ?? '',
    isActive: slide.isActive ?? false,
  };
}

export function HeroSlideForm({
  isOpen,
  onClose,
  onSave,
  slide,
  isSaving = false,
}: HeroSlideFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const temporaryUploadIdRef = useRef<string>('');
  const staleLockCleanupTimerRef = useRef<number | null>(null);

  const { toast } = useToast();

  const form = useForm<HeroSlideFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getSlideFormValues(slide),
  });

  const isBusy = isUploading || isSaving;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    temporaryUploadIdRef.current =
      slide?.id ??
      `new-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    form.reset(getSlideFormValues(slide));
  }, [form, isOpen, slide]);

  /*
   * Safety cleanup:
   * In some Radix Dialog versions, rapidly closing a controlled dialog
   * after an async upload can leave body pointer-events disabled.
   */
  useEffect(() => {
    if (isOpen) {
      if (staleLockCleanupTimerRef.current !== null) {
        window.clearTimeout(staleLockCleanupTimerRef.current);
        staleLockCleanupTimerRef.current = null;
      }

      return;
    }

    staleLockCleanupTimerRef.current = window.setTimeout(() => {
      const openDialog = document.querySelector(
        '[role="dialog"][data-state="open"]'
      );

      if (!openDialog) {
        document.body.style.removeProperty('pointer-events');
      }

      staleLockCleanupTimerRef.current = null;
    }, 350);

    return () => {
      if (staleLockCleanupTimerRef.current !== null) {
        window.clearTimeout(staleLockCleanupTimerRef.current);
        staleLockCleanupTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: 'imageUrl' | 'mobileImageUrl'
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: 'Unsupported image',
        description:
          'Please choose a JPEG, PNG, WebP or AVIF image.',
        variant: 'destructive',
      });

      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: 'Image is too large',
        description: 'Please choose an image smaller than 8 MB.',
        variant: 'destructive',
      });

      event.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const uploadId =
        slide?.id ||
        temporaryUploadIdRef.current ||
        `new-${Date.now()}`;

      const downloadURL = await uploadImage(
        file,
        uploadId,
        fieldName === 'imageUrl' ? 'desktop' : 'mobile'
      );

      form.setValue(fieldName, downloadURL, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      toast({
        title: 'Image uploaded',
        description:
          fieldName === 'imageUrl'
            ? 'The desktop image was uploaded successfully.'
            : 'The mobile image was uploaded successfully.',
      });
    } catch (error) {
      console.error('Hero slide image upload failed:', error);

      toast({
        title: 'Upload failed',
        description:
          error instanceof Error
            ? error.message
            : 'The image could not be uploaded.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (
    values: HeroSlideFormValues
  ): Promise<void> => {
    if (isBusy) {
      return;
    }

    /*
     * Preserve existing fields such as order, CTA configuration
     * and publishing dates while replacing the fields edited here.
     */
    const existingSlideData: Partial<HeroSlide> = slide
      ? { ...slide }
      : {};

    delete existingSlideData.id;

    const saveData = {
      ...existingSlideData,
      ...values,
    } as HeroSlideSaveData;

    await onSave(saveData);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isBusy) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-[625px]"
        onEscapeKeyDown={(event) => {
          if (isBusy) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isBusy) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {slide ? 'Edit Hero Slide' : 'Add Hero Slide'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="hero-slide-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the hero slide title"
                      disabled={isBusy}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Enter an optional subtitle"
                      disabled={isBusy}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desktop Image</FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={isBusy}
                      onChange={(event) => {
                        void handleFileChange(event, 'imageUrl');
                      }}
                    />
                  </FormControl>

                  {field.value ? (
                    <div className="overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={field.value}
                        alt="Desktop hero preview"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Image</FormLabel>

                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={isBusy}
                      onChange={(event) => {
                        void handleFileChange(event, 'mobileImageUrl');
                      }}
                    />
                  </FormControl>

                  {field.value ? (
                    <div className="w-full max-w-[240px] overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={field.value}
                        alt="Mobile hero preview"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageAlt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image alternative text</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Describe the image for accessibility"
                      disabled={isBusy}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Active</FormLabel>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Display this slide on the public homepage.
                    </p>
                  </div>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isBusy}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isBusy}
              >
                {isUploading
                  ? 'Uploading...'
                  : isSaving
                    ? 'Saving...'
                    : slide
                      ? 'Update Hero Slide'
                      : 'Create Hero Slide'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

