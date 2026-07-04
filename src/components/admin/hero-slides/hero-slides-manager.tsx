
'use client';

import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { HeroSlide } from '@/types/hero-slide';

import {
  addHeroSlide,
  deleteHeroSlide,
  duplicateHeroSlide,
  getHeroSlides,
  updateHeroSlide,
  updateSlidesOrder,
} from '@/lib/firestore/hero-slides';

import { HeroSlideCard } from './hero-slide-card';
import { HeroSlideForm } from './hero-slide-form';

type HeroSlideFormData = Omit<HeroSlide, 'id'>;

export function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [isSavingSlide, setIsSavingSlide] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [deletingSlideId, setDeletingSlideId] = useState<string | null>(null);
  const [duplicatingSlideId, setDuplicatingSlideId] = useState<string | null>(
    null
  );

  const clearEditingTimerRef = useRef<number | null>(null);

  const { toast } = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    const loadSlides = async () => {
      setLoading(true);

      try {
        const fetchedSlides = await getHeroSlides();

        if (cancelled) {
          return;
        }

        setSlides(
          [...fetchedSlides].sort(
            (firstSlide, secondSlide) =>
              (firstSlide.order ?? 0) - (secondSlide.order ?? 0)
          )
        );
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);

        if (!cancelled) {
          toastRef.current({
            title: 'Error fetching slides',
            description: 'The hero slides could not be loaded.',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSlides();

    return () => {
      cancelled = true;

      if (clearEditingTimerRef.current !== null) {
        window.clearTimeout(clearEditingTimerRef.current);
      }
    };
  }, []);

  const cancelPendingEditingCleanup = () => {
    if (clearEditingTimerRef.current !== null) {
      window.clearTimeout(clearEditingTimerRef.current);
      clearEditingTimerRef.current = null;
    }
  };

  const clearEditingSlideAfterDialogCloses = () => {
    cancelPendingEditingCleanup();

    clearEditingTimerRef.current = window.setTimeout(() => {
      setEditingSlide(null);
      clearEditingTimerRef.current = null;
    }, 250);
  };

  const closeForm = () => {
    if (isSavingSlide) {
      return;
    }

    setIsFormOpen(false);
    clearEditingSlideAfterDialogCloses();
  };

  const handleAddClick = () => {
    if (isSavingSlide) {
      return;
    }

    cancelPendingEditingCleanup();
    setEditingSlide(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (slide: HeroSlide) => {
    if (isSavingSlide) {
      return;
    }

    cancelPendingEditingCleanup();
    setEditingSlide(slide);
    setIsFormOpen(true);
  };

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    setSlides((currentSlides) => {
      if (
        dragIndex < 0 ||
        hoverIndex < 0 ||
        dragIndex >= currentSlides.length ||
        hoverIndex >= currentSlides.length ||
        dragIndex === hoverIndex
      ) {
        return currentSlides;
      }

      const reorderedSlides = [...currentSlides];
      const [draggedSlide] = reorderedSlides.splice(dragIndex, 1);

      if (!draggedSlide) {
        return currentSlides;
      }

      reorderedSlides.splice(hoverIndex, 0, draggedSlide);

      return reorderedSlides.map((slide, index) => ({
        ...slide,
        order: index + 1,
      }));
    });
  };

  const handleSaveOrder = async () => {
    if (slides.length === 0 || isSavingOrder) {
      return;
    }

    setIsSavingOrder(true);

    try {
      const orderUpdates = slides.map((slide, index) => ({
        id: slide.id,
        order: index + 1,
      }));

      await updateSlidesOrder(orderUpdates);

      setSlides((currentSlides) =>
        currentSlides.map((slide, index) => ({
          ...slide,
          order: index + 1,
        }))
      );

      toast({
        title: 'Order saved',
        description: 'The hero slide order has been updated.',
      });
    } catch (error) {
      console.error('Failed to update hero slide order:', error);

      toast({
        title: 'Error saving order',
        description: 'The new hero slide order could not be saved.',
        variant: 'destructive',
      });

      try {
        const refreshedSlides = await getHeroSlides();

        setSlides(
          [...refreshedSlides].sort(
            (firstSlide, secondSlide) =>
              (firstSlide.order ?? 0) - (secondSlide.order ?? 0)
          )
        );
      } catch (refreshError) {
        console.error('Failed to refresh hero slides:', refreshError);
      }
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleDeleteClick = async (slide: HeroSlide) => {
    if (deletingSlideId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${slide.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingSlideId(slide.id);

    try {
      await deleteHeroSlide(slide.id, slide);

      setSlides((currentSlides) =>
        currentSlides
          .filter((currentSlide) => currentSlide.id !== slide.id)
          .map((currentSlide, index) => ({
            ...currentSlide,
            order: index + 1,
          }))
      );

      toast({
        title: 'Slide deleted',
        description: 'The hero slide has been deleted.',
      });
    } catch (error) {
      console.error('Failed to delete hero slide:', error);

      toast({
        title: 'Error deleting slide',
        description:
          error instanceof Error
            ? error.message
            : 'The hero slide could not be deleted.',
        variant: 'destructive',
      });
    } finally {
      setDeletingSlideId(null);
    }
  };

  const handleDuplicateClick = async (slide: HeroSlide) => {
    if (duplicatingSlideId !== null) {
      return;
    }

    setDuplicatingSlideId(slide.id);

    try {
      const newSlideId = await duplicateHeroSlide(slide);

      setSlides((currentSlides) => {
        const highestOrder = currentSlides.reduce(
          (highest, currentSlide) =>
            Math.max(highest, currentSlide.order ?? 0),
          0
        );

        const duplicatedSlide: HeroSlide = {
          ...slide,
          id: newSlideId,
          title: `${slide.title} (Copy)`,
          isActive: false,
          order: highestOrder + 1,
        };

        return [...currentSlides, duplicatedSlide].sort(
          (firstSlide, secondSlide) =>
            (firstSlide.order ?? 0) - (secondSlide.order ?? 0)
        );
      });

      toast({
        title: 'Slide duplicated',
        description: 'A copy of the hero slide has been created.',
      });
    } catch (error) {
      console.error('Failed to duplicate hero slide:', error);

      toast({
        title: 'Error duplicating slide',
        description:
          error instanceof Error
            ? error.message
            : 'The hero slide could not be duplicated.',
        variant: 'destructive',
      });
    } finally {
      setDuplicatingSlideId(null);
    }
  };

  const handleFormSave = async (
    slideData: HeroSlideFormData
  ): Promise<void> => {
    if (isSavingSlide) {
      return;
    }

    setIsSavingSlide(true);

    const slideBeingEdited = editingSlide;
    let saveSucceeded = false;

    try {
      if (slideBeingEdited) {
        await updateHeroSlide(slideBeingEdited.id, slideData);

        setSlides((currentSlides) =>
          currentSlides
            .map((slide) =>
              slide.id === slideBeingEdited.id
                ? {
                    ...slide,
                    ...slideData,
                    id: slideBeingEdited.id,
                  }
                : slide
            )
            .sort(
              (firstSlide, secondSlide) =>
                (firstSlide.order ?? 0) - (secondSlide.order ?? 0)
            )
        );

        toast({
          title: 'Slide updated',
          description: 'The hero slide has been updated successfully.',
        });
      } else {
        const highestOrder = slides.reduce(
          (highest, slide) => Math.max(highest, slide.order ?? 0),
          0
        );

        const requestedOrder = Number(slideData.order);

        const finalSlideData: HeroSlideFormData = {
          ...slideData,
          order:
            Number.isFinite(requestedOrder) && requestedOrder > 0
              ? requestedOrder
              : highestOrder + 1,
        };

        const newSlideId = await addHeroSlide(finalSlideData);

        const createdSlide: HeroSlide = {
          ...finalSlideData,
          id: newSlideId,
        };

        setSlides((currentSlides) =>
          [...currentSlides, createdSlide].sort(
            (firstSlide, secondSlide) =>
              (firstSlide.order ?? 0) - (secondSlide.order ?? 0)
          )
        );

        toast({
          title: 'Slide added',
          description: 'A new hero slide has been added successfully.',
        });
      }

      saveSucceeded = true;
    } catch (error) {
      console.error('Failed to save hero slide:', error);

      toast({
        title: 'Error saving slide',
        description:
          error instanceof Error
            ? error.message
            : 'The hero slide could not be saved.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSlide(false);
    }

    if (saveSucceeded) {
      /*
       * Close the controlled dialog, but keep HeroSlideForm mounted.
       * This lets Radix remove its overlay, focus trap and page lock.
       */
      setIsFormOpen(false);
      clearEditingSlideAfterDialogCloses();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8">
        <AdminPageHeader title="Hero Slides">
          <Button
            type="button"
            onClick={handleAddClick}
            disabled={isSavingSlide}
          >
            Add Hero Slide
          </Button>
        </AdminPageHeader>

        {loading ? (
          <div className="rounded-lg border bg-white p-8">
            <p className="text-sm text-muted-foreground">
              Loading hero slides...
            </p>
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              No hero slides have been created yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first slide to display content in the homepage hero
              section.
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={handleAddClick}
              disabled={isSavingSlide}
            >
              Add your first hero slide
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {slides.map((slide, index) => (
                <HeroSlideCard
                  key={slide.id}
                  index={index}
                  slide={slide}
                  moveSlide={moveSlide}
                  onEdit={() => handleEditClick(slide)}
                  onDelete={() => void handleDeleteClick(slide)}
                  onDuplicate={() => void handleDuplicateClick(slide)}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void handleSaveOrder()}
                disabled={isSavingOrder || isSavingSlide}
              >
                {isSavingOrder ? 'Saving Order...' : 'Save Order'}
              </Button>
            </div>
          </div>
        )}

        {/*
         * Do not conditionally unmount this component.
         * The open prop controls whether the dialog is visible.
         */}
        <HeroSlideForm
          isOpen={isFormOpen}
          onClose={closeForm}
          onSave={handleFormSave}
          slide={editingSlide}
          isSaving={isSavingSlide}
        />
      </div>
    </DndProvider>
  );
}

