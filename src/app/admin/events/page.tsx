
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import AdminDataTable from "@/components/admin/AdminDataTable";
import { getCollectionDocuments, deleteCollectionDocument } from "@/lib/firestore/crud";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from "lucide-react"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getCollectionDocuments("events");
      setEvents(eventsData);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteCollectionDocument('events', id);
        await fetchEvents();
      } catch (error) {
        setError('Failed to delete event.');
      }
    }
  };

  const actions = (event: any) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(event.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div>
      <AdminPageHeader title="Events">
        <Link href="/admin/events/new">
          <Button>Add Event</Button>
        </Link>
      </AdminPageHeader>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <AdminDataTable 
          columns={["title", "startDate", "endDate", "location", "eventStatus", "published", "featured", "updatedAt"]}
          data={events} 
          actions={actions}
        />
      )}
    </div>
  );
}
