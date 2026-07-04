
'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '@/firebase/client-provider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Initiative, InitiativeStatus } from '@/types/initiative';
import { InitiativeForm } from '@/components/admin/initiatives/InitiativeForm';
import { InitiativeImage } from '@/components/admin/initiatives/InitiativeImage';
import { useToast } from '@/hooks/use-toast';
import { deleteInitiative } from '@/lib/firestore/initiatives';

export default function InitiativesPage() {
    const { db } = useFirebase();
    const { toast } = useToast();

    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'all'>('all');

    useEffect(() => {
        if (!db) {
          return;
        }

        let isActive = true;

        const unsubscribe = onSnapshot(
            collection(db, "initiatives"),
            (snapshot) => {
                if (!isActive) {
                    return;
                }

                const records = snapshot.docs
                    .map((snapshotDocument) => {
                        const data = snapshotDocument.data();
                        return {
                            docId: snapshotDocument.id,
                            id: typeof data.id === "string" ? data.id : snapshotDocument.id,
                            title: typeof data.title === "string" ? data.title : "",
                            summary: typeof data.summary === "string" ? data.summary : "",
                            imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : "",
                            order: typeof data.order === "number" ? data.order : 0,
                            status: data.status === "published" ? "published" : "draft",
                        } as Initiative;
                    })
                    .sort(
                        (a, b) =>
                            (a.order ?? 0) - (b.order ?? 0) ||
                            (a.title ?? '').localeCompare(b.title ?? '')
                    );

                setInitiatives(records);
                setLoading(false);
            },
            (listenerError) => {
                if (!isActive) {
                    return;
                }
                console.error("Initiatives listener failed:", listenerError);
                setLoadError(listenerError.message);
                setLoading(false);
            }
        );

        return () => {
            isActive = false;
            unsubscribe();
        };
    }, [db]);

    useEffect(() => {
        if (loadError) {
            toast({
                title: 'Error loading initiatives',
                description: loadError,
                variant: 'destructive',
            });
        }
    }, [loadError, toast]);

    const filteredInitiatives = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        return initiatives.filter((initiative) => {
            const title = initiative.title?.toLowerCase() ?? "";
            const summary = initiative.summary?.toLowerCase() ?? "";
            const matchesSearch = !normalizedSearch || title.includes(normalizedSearch) || summary.includes(normalizedSearch);
            const matchesStatus = statusFilter === 'all' || initiative.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [initiatives, searchTerm, statusFilter]);

    const openForm = (initiative: Initiative | null = null) => {
        setEditingInitiative(initiative);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setEditingInitiative(null);
        setIsFormOpen(false);
    };

    const handleDelete = async (initiative: Initiative) => {
        if (!window.confirm(`Are you sure you want to delete "${initiative.title}"?`)) return;
        try {
            await deleteInitiative(initiative.docId, initiative.imageUrl ?? '');
            toast({
                title: 'Initiative deleted',
                description: 'The initiative has been successfully deleted.',
            });
        } catch (error) {
            toast({
                title: 'Error deleting initiative',
                description: 'The initiative could not be deleted.',
                variant: 'destructive',
            });
        }
    };

    const totalInitiatives = initiatives.length;
    const publishedInitiatives = initiatives.filter(i => i.status === 'published').length;
    const draftInitiatives = totalInitiatives - publishedInitiatives;

    if (!db) {
        return <p>Initializing Firebase...</p>;
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader title="Initiatives">
                <Button onClick={() => openForm()}>Add Initiative</Button>
            </AdminPageHeader>
            <p className="text-muted-foreground">Manage the programmes and initiatives shown on the DIB Foundation website.</p>

            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardContent className="p-6"><h3 className="text-lg font-semibold">Total Initiatives</h3><p className="text-2xl font-bold">{totalInitiatives}</p></CardContent></Card>
                <Card><CardContent className="p-6"><h3 className="text-lg font-semibold">Published</h3><p className="text-2xl font-bold">{publishedInitiatives}</p></CardContent></Card>
                <Card><CardContent className="p-6"><h3 className="text-lg font-semibold">Drafts</h3><p className="text-2xl font-bold">{draftInitiatives}</p></CardContent></Card>
            </div>

            <div className="flex items-center space-x-4">
                <Input
                    placeholder="Search by title or summary..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InitiativeStatus | 'all')}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <p>Loading initiatives...</p>
            ) : loadError ? (
                <div role="alert" className="text-red-600">{loadError}</div>
            ) : filteredInitiatives.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No initiatives found</h3>
                    <p className="text-sm text-muted-foreground">No initiatives match your current filters.</p>
                    {initiatives.length === 0 && <Button className="mt-4" onClick={() => openForm()}>Add First Initiative</Button>}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredInitiatives.map(initiative => (
                        <Card key={initiative.docId}>
                            <InitiativeImage imageUrl={initiative.imageUrl} title={initiative.title} />
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">{initiative.title}</h4>
                                    <Badge variant={initiative.status === 'published' ? 'default' : 'secondary'}>{initiative.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{initiative.summary}</p>
                                <p className="text-sm mt-2">Order: {initiative.order}</p>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button variant="outline" size="sm" onClick={() => openForm(initiative)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(initiative)}>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
            <InitiativeForm isOpen={isFormOpen} onClose={closeForm} initiative={editingInitiative} />
        </div>
    );
}
