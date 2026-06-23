
import { Button } from "@/components/ui/button";

interface AdminFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function AdminFormActions({ isSubmitting, onCancel }: AdminFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-6">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
