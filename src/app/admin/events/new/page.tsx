
'use client'

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { serverTimestamp } from 'firebase/firestore';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCollectionDocument } from '@/lib/firestore/crud';

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

export default function NewEventPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featured: false,
      published: false,
    },
  });

  const title = watch('title');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onSubmit = async (data: any) => {
    try {
      await createCollectionDocument('events', { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      router.push('/admin/events');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Add New Event" />
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
