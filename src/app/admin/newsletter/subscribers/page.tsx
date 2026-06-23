
"use client";

import * as React from "react";
import { useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  status: "active" | "inactive";
  source: string;
  createdAt: any;
}

export default function SubscribersPage() {
  const { db, status, error } = useFirestore();
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscribers = async () => {
    if (!db) return;
    setIsLoading(true);
    let q = query(collection(db, "newsletterSubscribers"));

    if (statusFilter !== "all") {
      q = query(q, where("status", "==", statusFilter));
    }

    const querySnapshot = await getDocs(q);
    const subscriberList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Subscriber));
    
    const filteredList = subscriberList.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setSubscribers(filteredList);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (status === 'ready') {
      fetchSubscribers();
    } else if (status === 'error') {
      setIsLoading(false);
    }
  }, [db, status, statusFilter, searchTerm]);

  const handleStatusChange = async (id: string, currentStatus: "active" | "inactive") => {
    if (!db) return;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const subscriberRef = doc(db, "newsletterSubscribers", id);
      await updateDoc(subscriberRef, { status: newStatus, updatedAt: new Date() });
      fetchSubscribers();
      toast({ title: "Success", description: "Subscriber status updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not update subscriber status." });
    }
  };
  
  const exportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Status,Source,Subscribed At\n" 
      + subscribers.map(s => `${s.email},${s.status},${s.source},${s.createdAt.toDate().toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newsletter Subscribers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Select onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportCsv}>Export CSV</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Subscribed At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>{subscriber.status}</TableCell>
                <TableCell>{subscriber.source}</TableCell>
                <TableCell>{subscriber.createdAt.toDate().toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant={subscriber.status === 'active' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleStatusChange(subscriber.id, subscriber.status)}
                  >
                    {subscriber.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
