
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const campaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

interface CampaignFormProps {
  campaign?: any;
  campaignId?: string;
}

export function CampaignForm({ campaign, campaignId }: CampaignFormProps) {
  const { db, status, error } = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign || {
      title: "",
      subject: "",
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof campaignSchema>) => {
    if (!db) return;

    try {
      if (campaignId) {
        const campaignRef = doc(db, "newsletterCampaigns", campaignId);
        await updateDoc(campaignRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Campaign updated." });
      } else {
        await addDoc(collection(db, "newsletterCampaigns"), {
          ...data,
          status: "draft",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Success", description: "Campaign saved as draft." });
        router.push("/admin/newsletter/campaigns");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not save campaign." });
    }
  };
  
  const sendCampaign = async () => {
      // This will be implemented in a later step
      alert("Sending functionality to be added!");
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{campaignId ? "Edit Campaign" : "New Campaign"}</CardTitle>
        <CardDescription>Craft your newsletter and send it to your subscribers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Campaign Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Newsletter Subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your newsletter content here..." {...field} rows={20} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="submit" variant="outline">Save Draft</Button>
              <Button type="button" onClick={() => alert(form.getValues("content"))}>Preview</Button>
              {campaignId && <Button type="button" onClick={sendCampaign}>Send</Button>}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
