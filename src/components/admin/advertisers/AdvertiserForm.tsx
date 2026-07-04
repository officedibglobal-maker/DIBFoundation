"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  type WithFieldValue,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import AdminFormActions from "@/components/admin/AdminFormActions";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { advertiserConverter } from "@/lib/firestore/converters";
import { type Advertiser } from "@/types/advertiser";
import { type StoredDocument } from "@/types/firestore";

const optionalUrlSchema = z.union([
  z.literal(""),
  z.string().url({
    message: "Please enter a valid URL.",
  }),
]);

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  websiteUrl: optionalUrlSchema.optional(),
  logoUrl: optionalUrlSchema.optional(),
  status: z.enum(["active", "inactive", "blocked"]),
  notes: z.string().optional(),
});

type AdvertiserFormValues = z.infer<typeof formSchema>;

interface AdvertiserFormProps {
  advertiser?: StoredDocument<Advertiser>;
}

export function AdvertiserForm({
  advertiser,
}: AdvertiserFormProps) {
  const router = useRouter();

  const form = useForm<AdvertiserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: advertiser
      ? {
          companyName: advertiser.companyName,
          contactName: advertiser.contactName,
          contactEmail: advertiser.contactEmail,
          phone: advertiser.phone ?? "",
          websiteUrl: advertiser.websiteUrl ?? "",
          logoUrl: advertiser.logoUrl ?? "",
          status: advertiser.status,
          notes: advertiser.notes ?? "",
        }
      : {
          companyName: "",
          contactName: "",
          contactEmail: "",
          phone: "",
          websiteUrl: "",
          logoUrl: "",
          status: "active",
          notes: "",
        },
  });

  async function onSubmit(values: AdvertiserFormValues) {
    try {
      const advertiserData: WithFieldValue<Advertiser> = {
        companyName: values.companyName.trim(),
        contactName: values.contactName.trim(),
        contactEmail: values.contactEmail.trim(),
        status: values.status,

        ...(values.phone?.trim()
          ? { phone: values.phone.trim() }
          : {}),

        ...(values.websiteUrl?.trim()
          ? { websiteUrl: values.websiteUrl.trim() }
          : {}),

        ...(values.logoUrl?.trim()
          ? { logoUrl: values.logoUrl.trim() }
          : {}),

        ...(values.notes?.trim()
          ? { notes: values.notes.trim() }
          : {}),
      };

      if (advertiser) {
        const advertiserRef = doc(
          db,
          "advertisers",
          advertiser.id,
        ).withConverter(advertiserConverter);

        await setDoc(advertiserRef, advertiserData, {
          merge: true,
        });

        toast({
          title: "Advertiser updated",
          description:
            `${values.companyName} has been updated.`,
        });
      } else {
        const advertisersRef = collection(
          db,
          "advertisers",
        ).withConverter(advertiserConverter);

        await addDoc(advertisersRef, advertiserData);

        toast({
          title: "Advertiser created",
          description:
            `${values.companyName} has been created.`,
        });
      }

      router.push("/admin/advertisers");
      router.refresh();
    } catch (error) {
      console.error("Error saving advertiser:", error);

      toast({
        title: "Error saving advertiser",
        description:
          error instanceof FirebaseError
            ? error.message
            : "An unexpected error occurred while saving the advertiser.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>

              <FormControl>
                <ImageUploader
                  onUploadSuccess={field.onChange}
                  initialImageUrl={field.value || undefined}
                  folder="advertiser-logos"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="DIBF Demo Partner"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>

              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>

              <FormControl>
                <Input
                  type="tel"
                  placeholder="+233..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>

              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>

                  <SelectItem value="inactive">
                    Inactive
                  </SelectItem>

                  <SelectItem value="blocked">
                    Blocked
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>

              <FormControl>
                <Textarea
                  placeholder="Notes about the advertiser"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <AdminFormActions
          isSubmitting={form.formState.isSubmitting}
          onCancel={() =>
            router.push("/admin/advertisers")
          }
        />
      </form>
    </Form>
  );
}