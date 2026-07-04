"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  Initiative,
  InitiativeStatus,
} from "@/types/initiative";

import {
  addInitiative,
  updateInitiative,
} from "@/lib/firestore/initiatives";

import { useToast } from "@/hooks/use-toast";

interface InitiativeFormProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: Initiative | null;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function InitiativeForm({
  isOpen,
  onClose,
  initiative,
}: InitiativeFormProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] =
    useState<InitiativeStatus>("draft");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /*
   * Reset the form only when the dialog opens or the selected
   * initiative's actual values change.
   *
   * Depending directly on the entire initiative object can cause
   * repeated resets when Firestore returns a newly created object
   * containing the same values.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setTitle(initiative?.title ?? "");
    setSummary(initiative?.summary ?? "");
    setImageUrl(initiative?.imageUrl ?? "");
    setOrder(initiative?.order ?? 0);
    setStatus(initiative?.status ?? "draft");

    setImageFile(null);
    setPreviewFailed(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    isOpen,
    initiative?.docId,
    initiative?.title,
    initiative?.summary,
    initiative?.imageUrl,
    initiative?.order,
    initiative?.status,
  ]);

  /*
   * Generate a temporary browser preview without putting that
   * temporary URL into the Firestore imageUrl field.
   */
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setPreviewUrl(objectUrl);
    setPreviewFailed(false);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const resetFileSelection = () => {
    setImageFile(null);
    setPreviewUrl("");
    setPreviewFailed(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    resetFileSelection();
    onClose();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description:
          "Please select a JPG, PNG, or WebP image.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "File too large",
        description:
          "Please select an image smaller than 5 MB.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewFailed(false);
  };

  const handleImageUrlChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setImageUrl(value);
    setPreviewFailed(false);

    // Manually entering a URL cancels a previously selected upload.
    if (imageFile) {
      resetFileSelection();
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const cleanedTitle = title.trim();
    const cleanedSummary = summary.trim();
    const cleanedImageUrl = imageUrl.trim();

    if (!cleanedTitle || !cleanedSummary) {
      toast({
        title: "Missing fields",
        description: "Title and summary are required.",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isFinite(order) || order < 0) {
      toast({
        title: "Invalid display order",
        description:
          "Display order must be zero or a positive number.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const initiativeData = {
        title: cleanedTitle,
        summary: cleanedSummary,

        /*
         * This remains the existing or manually entered permanent URL.
         * The Firestore helper must replace it with the Firebase Storage
         * download URL when imageFile is supplied.
         */
        imageUrl: cleanedImageUrl,

        order,
        status,
      };

      if (initiative) {
        await updateInitiative(
          initiative.docId,
          initiativeData,
          imageFile ?? undefined
        );

        toast({
          title: "Initiative updated",
          description:
            "The initiative was updated successfully.",
        });
      } else {
        await addInitiative(
          initiativeData,
          imageFile ?? undefined
        );

        toast({
          title: "Initiative created",
          description:
            "The initiative was created successfully.",
        });
      }

      resetFileSelection();
      onClose();
    } catch (error) {
      console.error("Failed to save initiative:", error);

      const description =
        error instanceof Error
          ? error.message
          : "Failed to save the initiative.";

      toast({
        title: "Unable to save initiative",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayedPreview = previewUrl || imageUrl;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]"
        onEscapeKeyDown={(event) => {
          if (isSaving) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (isSaving) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {initiative
              ? "Edit Initiative"
              : "Add Initiative"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="initiative-title">
                Title
              </Label>

              <Input
                id="initiative-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Mobile Clinic Outreach"
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initiative-summary">
                Summary
              </Label>

              <Textarea
                id="initiative-summary"
                value={summary}
                onChange={(event) =>
                  setSummary(event.target.value)
                }
                placeholder="Describe the initiative..."
                rows={5}
                disabled={isSaving}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initiative-image-url">
                Image URL
              </Label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="initiative-image-url"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="/images/initiatives/1.jpg"
                  disabled={isSaving}
                  className="flex-1"
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Upload image
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />

              <p className="text-xs text-muted-foreground">
                Upload a JPG, PNG or WebP image up to 5 MB,
                or enter a public image path.
              </p>
            </div>

            {displayedPreview && !previewFailed && (
              <div className="overflow-hidden rounded-lg border bg-muted">
                <img
                  key={displayedPreview}
                  src={displayedPreview}
                  alt="Initiative image preview"
                  className="h-52 w-full object-cover"
                  onError={() => setPreviewFailed(true)}
                />
              </div>
            )}

            {displayedPreview && previewFailed && (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-muted text-sm text-muted-foreground">
                The selected image could not be displayed.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="initiative-order">
                  Display order
                </Label>

                <Input
                  id="initiative-order"
                  type="number"
                  min={0}
                  value={order}
                  disabled={isSaving}
                  onChange={(event) =>
                    setOrder(
                      Number.parseInt(
                        event.target.value || "0",
                        10
                      )
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initiative-status">
                  Status
                </Label>

                <Select
                  value={status}
                  disabled={isSaving}
                  onValueChange={(value) =>
                    setStatus(
                      value as InitiativeStatus
                    )
                  }
                >
                  <SelectTrigger id="initiative-status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="draft">
                      Draft
                    </SelectItem>

                    <SelectItem value="published">
                      Published
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isSaving ||
                !title.trim() ||
                !summary.trim()
              }
            >
              {isSaving
                ? "Saving..."
                : initiative
                  ? "Save changes"
                  : "Create initiative"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}