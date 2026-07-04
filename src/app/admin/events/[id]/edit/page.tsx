
'use client'

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDocumentById, updateCollectionDocument } from '@/lib/firestore/crud';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  imagePath: z.string().optional(),
  imageAlt: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  registrationUrl: z.string().url().optional(),
  capacity: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().nonnegative().optional()),
  eventStatus: z.enum(['upcoming', 'ongoing', 'completed', 'postponed', 'cancelled']),
  featured: z.boolean(),
  published: z.boolean(),
  order: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().optional()),
});

type EventFormValues = z.infer<typeof formSchema>;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getDocumentById('events', id as string);
        if (eventData) {
          reset(eventData as unknown as EventFormValues);
        }
      } catch (err) {
        setError('Failed to fetch event data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, reset]);

  const title = watch('title');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      await updateCollectionDocument('events', id as string, data);
      router.push('/admin/events');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <AdminPageHeader title="Edit Event" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="title">Title</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  setValue('slug', generateSlug(e.target.value));
                }} />
              )}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <Controller name="slug" control={control} render={({ field }) => <Input {...field} />} />
            {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
          </div>
        </div>

        {/* Add other form fields here */}

        <AdminFormActions isSubmitting={isSubmitting} onCancel={() => router.back()} />
      </form>
    </div>
  );
}
