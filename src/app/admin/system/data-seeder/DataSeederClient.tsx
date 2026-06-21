
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seedFirestore } from '@/lib/seed/seed-firestore';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { SEED_REGISTRY } from '@/lib/seed/seed-registry';
import type { SeedResult } from '@/lib/seed/seed-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Group collections by category for the dropdown
const groupedCollections = SEED_REGISTRY.reduce((acc, entry) => {
  if (!acc[entry.category]) {
    acc[entry.category] = [];
  }
  acc[entry.category].push(entry);
  return acc;
}, {} as Record<string, typeof SEED_REGISTRY>);

export function DataSeederClient() {
  const { db, status, error } = useFirestore();
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [results, setResults] = useState<SeedResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'dry-run' | 'seed'>('dry-run');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsRunning(true);
    setResults([]);
    setErrorMessage(null);

    if (status !== 'ready' || !db) {
      setErrorMessage(
        error?.message ??
          'Firestore is still initializing. Please wait and try again.'
      );
      setIsRunning(false);
      return;
    }

    try {
      const seedResults = await seedFirestore(db, {
        mode,
        collection: selectedCollection === 'all' ? undefined : selectedCollection,
      });
      setResults(seedResults);
    } catch (e: any) {
      setErrorMessage(e.message || 'An unknown error occurred during seeding.');
    } finally {
      setIsRunning(false);
    }
  };

  const summary = {
    totalRegistered: SEED_REGISTRY.length,
    processed: results.length,
    succeeded: results.filter(r => r.status === 'success').length,
    schemaOnly: results.filter(r => r.status === 'schema-created').length,
    subcollections: results.filter(r => r.collection.includes('/')).length,
    documents: results.reduce((acc, r) => acc + (r.count || 0), 0),
    failed: results.filter(r => r.status === 'error').length,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firestore Data Seeder</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <Select value={selectedCollection} onValueChange={setSelectedCollection}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {Object.entries(groupedCollections).map(([category, entries]) => (
                <SelectGroup key={category}>
                  <SelectLabel>{category}</SelectLabel>
                  {entries.map(entry => (
                    <SelectItem key={entry.key} value={entry.key}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Select value={mode} onValueChange={(value) => setMode(value as 'dry-run' | 'seed')}>
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="dry-run">Dry Run</SelectItem>
                <SelectItem value="seed">Seed Data</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleSeed}
            disabled={isRunning || status !== 'ready' || !db}
            className="w-full md:w-auto"
          >
            {isRunning
              ? 'Running Seeder...'
              : mode === 'dry-run'
              ? 'Run Seeder (Dry Run)'
              : 'Run Seeder'}
          </Button>
        </CardContent>
        {status === 'error' && (
          <CardContent>
            <p className="text-sm text-destructive">
              {error?.message ?? 'Firebase initialization failed.'}
            </p>
          </CardContent>
        )}
        {errorMessage && (
          <CardContent>
            <p className="text-sm text-destructive">{errorMessage}</p>
          </CardContent>
        )}
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Seeder Results</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Collections Processed</p>
                    <p className="text-2xl font-bold">{summary.processed}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <p className="text-sm text-muted-foreground">Documents Processed</p>
                    <p className="text-2xl font-bold">{summary.documents}</p>
                </div>
                <div className="p-4 bg-green-100 rounded-lg dark:bg-green-900/50">
                    <p className="text-sm text-green-600 dark:text-green-400">Succeeded</p>
                    <p className="text-2xl font-bold">{summary.succeeded + summary.schemaOnly}</p>
                </div>
                 <div className="p-4 bg-red-100 rounded-lg dark:bg-red-900/50">
                    <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                    <p className="text-2xl font-bold">{summary.failed}</p>
                </div>
            </div>

            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.collection}</TableCell>
                      <TableCell>{result.status}</TableCell>
                      <TableCell>{result.mode}</TableCell>
                      <TableCell>{result.count ?? 'N/A'}</TableCell>
                      <TableCell>{result.message || result.error || ' '}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Show Raw JSON Output</AccordionTrigger>
                <AccordionContent>
                  <pre className="p-4 bg-gray-100 rounded-md dark:bg-gray-800 text-sm overflow-x-auto">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
