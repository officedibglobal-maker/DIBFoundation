
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { FocusAreaSchema } from "@/lib/models/focus-areas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconMap } from "@/components/IconMap";

interface FocusAreaFormProps {
  onSubmit: (values: z.infer<typeof FocusAreaSchema>) => void;
  defaultValues?: z.infer<typeof FocusAreaSchema>;
}

export function FocusAreaForm({ onSubmit, defaultValues }: FocusAreaFormProps) {
  const form = useForm<z.infer<typeof FocusAreaSchema>>({
    resolver: zodResolver(FocusAreaSchema),
    defaultValues: defaultValues || {
      name: "",
      icon: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Focus Area Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(iconMap).map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center">
                        {iconMap[iconName as keyof typeof iconMap]({
                          className: "mr-2 h-5 w-5",
                        })}
                        {iconName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
