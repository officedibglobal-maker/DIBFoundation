
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: "draft" | "sent";
  recipientCount?: number;
  sentAt?: any;
  createdAt: any;
}

export default function CampaignsPage() {
  const { db, status, error } = useFirestore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'ready' || !db) {
        if(status === 'error') setIsLoading(false);
        return;
    }
    const fetchCampaigns = async () => {
      const q = query(collection(db, "newsletterCampaigns"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setCampaigns(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Campaign)));
      setIsLoading(false);
    };

    fetchCampaigns();
  }, [db, status]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Newsletter Campaigns</CardTitle>
        <Button asChild>
            <Link href="/admin/newsletter/campaigns/new">
              <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                    <Link href={`/admin/newsletter/campaigns/${campaign.id}`} className="hover:underline">
                        {campaign.title}
                    </Link>
                </TableCell>
                <TableCell>{campaign.subject}</TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>{campaign.recipientCount || "N/A"}</TableCell>
                <TableCell>{campaign.sentAt ? campaign.sentAt.toDate().toLocaleString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
