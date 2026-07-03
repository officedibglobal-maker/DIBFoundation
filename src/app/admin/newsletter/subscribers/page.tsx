"use client";

import * as React from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { useToast } from "@/hooks/use-toast";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { newsletterSubscriberConverter } from "@/lib/firestore/converters";
import type {
  NewsletterSubscriber,
  NewsletterSubscriberStatus,
} from "@/types/newsletter-subscriber";
import type { StoredDocument } from "@/types/firestore";

type StatusFilter = "all" | NewsletterSubscriberStatus;

type SubscriberRow = StoredDocument<NewsletterSubscriber> & {
  email: string;
  status: NewsletterSubscriberStatus;
  source: string;
  subscribedAt: Timestamp | null;
  welcomeEmailSent: boolean;
};

function isSubscriberStatus(
  value: unknown,
): value is NewsletterSubscriberStatus {
  return (
    value === "active" ||
    value === "inactive" ||
    value === "unsubscribed"
  );
}

function isStatusFilter(
  value: string,
): value is StatusFilter {
  return value === "all" || isSubscriberStatus(value);
}

function normalizeSubscriber(
  documentId: string,
  subscriber: NewsletterSubscriber,
): SubscriberRow | null {
  const email =
    typeof subscriber.email === "string"
      ? subscriber.email.trim()
      : "";

  if (!email) {
    console.warn(
      `Skipping newsletter subscription "${documentId}" because it has no valid email address.`,
    );

    return null;
  }

  const normalizedStatus =
    isSubscriberStatus(subscriber.status)
      ? subscriber.status
      : "active";

  const normalizedSource =
    typeof subscriber.source === "string" &&
    subscriber.source.trim().length > 0
      ? subscriber.source.trim()
      : "website";

  const normalizedSubscribedAt =
    subscriber.subscribedAt instanceof Timestamp
      ? subscriber.subscribedAt
      : subscriber.createdAt instanceof Timestamp
        ? subscriber.createdAt
        : null;

  return {
    ...subscriber,
    id: documentId,
    email,
    status: normalizedStatus,
    source: normalizedSource,
    subscribedAt: normalizedSubscribedAt,
    welcomeEmailSent:
      subscriber.welcomeEmailSent === true,
  };
}

function formatTimestamp(
  timestamp: Timestamp | null,
): string {
  if (!timestamp) {
    return "Not available";
  }

  return timestamp.toDate().toLocaleString();
}

function escapeCsvValue(value: string): string {
  const formulaSafeValue = /^[=+\-@]/.test(value)
    ? `'${value}`
    : value;

  return `"${formulaSafeValue.replace(/"/g, '""')}"`;
}

export default function SubscribersPage() {
  const { db, status, error } = useFirestore();
  const { toast } = useToast();

  const [subscriberList, setSubscriberList] =
    React.useState<SubscriberRow[]>([]);
  const [searchTerm, setSearchTerm] =
    React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusFilter>("all");
  const [isLoading, setIsLoading] =
    React.useState(true);
  const [
    updatingSubscriberId,
    setUpdatingSubscriberId,
  ] = React.useState<string | null>(null);

  const fetchSubscribers = React.useCallback(
    async () => {
      if (!db) {
        return;
      }

      setIsLoading(true);

      try {
        const subscriptionsCollection = collection(
          db,
          COLLECTIONS.newsletterSubscriptions,
        ).withConverter(newsletterSubscriberConverter);

        const subscriptionsQuery =
          statusFilter === "all"
            ? query(subscriptionsCollection)
            : query(
                subscriptionsCollection,
                where(
                  "status",
                  "==",
                  statusFilter,
                ),
              );

        const querySnapshot = await getDocs(
          subscriptionsQuery,
        );

        const normalizedSubscribers =
          querySnapshot.docs
            .map((subscriberDocument) =>
              normalizeSubscriber(
                subscriberDocument.id,
                subscriberDocument.data(),
              ),
            )
            .filter(
              (
                subscriber,
              ): subscriber is SubscriberRow =>
                subscriber !== null,
            )
            .sort(
              (
                firstSubscriber,
                secondSubscriber,
              ) => {
                const firstTimestamp =
                  firstSubscriber.subscribedAt?.toMillis() ??
                  0;

                const secondTimestamp =
                  secondSubscriber.subscribedAt?.toMillis() ??
                  0;

                return (
                  secondTimestamp - firstTimestamp
                );
              },
            );

        setSubscriberList(normalizedSubscribers);
      } catch (fetchError) {
        console.error(
          "Failed to load newsletter subscribers:",
          fetchError,
        );

        toast({
          title: "Unable to load subscribers",
          description:
            fetchError instanceof Error
              ? fetchError.message
              : "An unexpected error occurred while loading subscribers.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [db, statusFilter, toast],
  );

  React.useEffect(() => {
    if (status === "ready") {
      void fetchSubscribers();
      return;
    }

    if (status === "error") {
      setIsLoading(false);
    }
  }, [fetchSubscribers, status]);

  const filteredSubscribers =
    React.useMemo(() => {
      const normalizedSearchTerm = searchTerm
        .trim()
        .toLowerCase();

      if (!normalizedSearchTerm) {
        return subscriberList;
      }

      return subscriberList.filter(
        (subscriber) =>
          subscriber.email
            .toLowerCase()
            .includes(normalizedSearchTerm),
      );
    }, [searchTerm, subscriberList]);

  async function handleStatusChange(
    subscriber: SubscriberRow,
  ) {
    if (!db) {
      toast({
        title: "Database unavailable",
        description:
          "Firestore is not ready. Please refresh the page and try again.",
        variant: "destructive",
      });

      return;
    }

    const newStatus: NewsletterSubscriberStatus =
      subscriber.status === "active"
        ? "inactive"
        : "active";

    setUpdatingSubscriberId(subscriber.id);

    try {
      const subscriberReference = doc(
        db,
        COLLECTIONS.newsletterSubscriptions,
        subscriber.id,
      ).withConverter(newsletterSubscriberConverter);

      await updateDoc(subscriberReference, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Subscriber updated",
        description: `${subscriber.email} is now ${newStatus}.`,
      });

      await fetchSubscribers();
    } catch (updateError) {
      console.error(
        "Failed to update subscriber status:",
        updateError,
      );

      toast({
        title: "Unable to update subscriber",
        description:
          updateError instanceof Error
            ? updateError.message
            : "An unexpected error occurred while updating the subscriber.",
        variant: "destructive",
      });
    } finally {
      setUpdatingSubscriberId(null);
    }
  }

  function exportCsv() {
    if (filteredSubscribers.length === 0) {
      toast({
        title: "Nothing to export",
        description:
          "There are no visible subscribers to include in the CSV file.",
      });

      return;
    }

    const header = [
      "Email",
      "Status",
      "Source",
      "Subscribed At",
      "Welcome Email Sent",
    ];

    const rows = filteredSubscribers.map(
      (subscriber) => [
        subscriber.email,
        subscriber.status,
        subscriber.source,
        formatTimestamp(
          subscriber.subscribedAt,
        ),
        subscriber.welcomeEmailSent
          ? "Yes"
          : "No",
      ],
    );

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((value) =>
            escapeCsvValue(String(value)),
          )
          .join(","),
      )
      .join("\n");

    const csvBlob = new Blob(
      [`\uFEFF${csvContent}`],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const downloadUrl =
      URL.createObjectURL(csvBlob);
    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download =
      "newsletter-subscribers.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadUrl);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Newsletter Subscribers
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Loading subscribers...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Newsletter Subscribers
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">
            {error?.message ??
              "The subscriber list could not be loaded."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Newsletter Subscribers
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
          <Input
            type="search"
            placeholder="Search subscribers..."
            aria-label="Search newsletter subscribers"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="max-w-md"
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                if (isStatusFilter(value)) {
                  setStatusFilter(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Statuses
                </SelectItem>

                <SelectItem value="active">
                  Active
                </SelectItem>

                <SelectItem value="inactive">
                  Inactive
                </SelectItem>

                <SelectItem value="unsubscribed">
                  Unsubscribed
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              onClick={exportCsv}
            >
              Export CSV
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>
                Subscribed At
              </TableHead>
              <TableHead>
                Welcome Email
              </TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No newsletter subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map(
                (subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.email}
                    </TableCell>

                    <TableCell className="capitalize">
                      {subscriber.status}
                    </TableCell>

                    <TableCell className="capitalize">
                      {subscriber.source}
                    </TableCell>

                    <TableCell>
                      {formatTimestamp(
                        subscriber.subscribedAt,
                      )}
                    </TableCell>

                    <TableCell>
                      {subscriber.welcomeEmailSent
                        ? "Sent"
                        : "Not sent"}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant={
                          subscriber.status ===
                          "active"
                            ? "outline"
                            : "default"
                        }
                        size="sm"
                        disabled={
                          updatingSubscriberId ===
                          subscriber.id
                        }
                        onClick={() =>
                          void handleStatusChange(
                            subscriber,
                          )
                        }
                      >
                        {updatingSubscriberId ===
                        subscriber.id
                          ? "Updating..."
                          : subscriber.status ===
                              "active"
                            ? "Deactivate"
                            : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}