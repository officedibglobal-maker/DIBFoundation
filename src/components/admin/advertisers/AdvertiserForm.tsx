
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Advertiser } from "@/types/advertiser";
import { AdminFormActions } from "@/components/admin/AdminFormActions";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { advertiserConverter } from "@/lib/firestore/converters";
import { ImageUploader } from "@/components/ui/image-uploader";
import { StoredDocument } from "@/types/firestore";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  contactEmail: z.string().email(),
  phone: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  status: z.enum(["active", "inactive", "blocked"]),
  notes: z.string().optional(),
});

interface AdvertiserFormProps {
  advertiser?: StoredDocument<Advertiser>;
}

export const AdvertiserForm = ({ advertiser }: AdvertiserFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: advertiser || {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const advertiserData = { ...values };
      if (advertiser) {
        await updateDoc(
          doc(db, "advertisers", advertiser.id).withConverter(
            advertiserConverter
          ),
          advertiserData
        );
        toast({
          title: "Advertiser updated",
          description: `Advertiser ${values.companyName} has been updated.`,
        });
        router.push("/admin/advertisers");
      } else {
        await addDoc(
          collection(db, "advertisers").withConverter(advertiserConverter),
          advertiserData
        );
        toast({
          title: "Advertiser created",
          description: `Advertiser ${values.companyName} has been created.`,
        });
        router.push("/admin/advertisers");
      }
    } catch (error) {
      console.error("Error saving advertiser:", error);
      const firebaseError = error as FirebaseError;
      toast({
        title: "Error saving advertiser",
        description: firebaseError.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <ImageUploader 
                    onUploadSuccess={(url) => field.onChange(url)}
                    initialImageUrl={field.value}
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
                <Input placeholder="DIBF Demo Partner" {...field} />
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
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="john.doe@example.com" {...field} />
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
                <Input placeholder="+1234567890" {...field} />
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
                <Input placeholder="https://example.com" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
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
                <Textarea placeholder="Notes about the advertiser" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AdminFormActions
          isSubmitting={form.formState.isSubmitting}
          onCancel={() => router.push("/admin/advertisers")}
        />
      </form>
    </Form>
  );
};
