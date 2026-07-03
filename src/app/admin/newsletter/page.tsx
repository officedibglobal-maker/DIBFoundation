
"use client";

import { useMemo } from "react";
import { collection } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { newsletterCampaignConverter } from "@/lib/firestore/converters";
import { NewsletterCampaign } from "@/types/newsletter-campaign";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { db } from "@/firebase";
import { StoredDocument } from "@/types/firestore";

const NewsletterPage = () => {
  const newsletterCampaignsQuery = useMemo(() => {
    return collection(db, "newsletterCampaigns").withConverter(newsletterCampaignConverter);
  }, []);

  const { data: campaigns, loading, error } = useCollection(
    newsletterCampaignsQuery
  );

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    return campaigns;
  }, [campaigns]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    {
        key: "title",
        label: "Title",
    },
    {
        key: "subject",
        label: "Subject",
    },
    {
        key: "status",
        label: "Status",
    },
    {
        key: "sentAt",
        label: "Sent At",
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Newsletter Campaigns">
        <Link href="/admin/newsletter/new">
          <Button>New Campaign</Button>
        </Link>
      </AdminPageHeader>
      <div className="p-4">
        <AdminDataTable
          columns={columns}
          data={filteredCampaigns}
          renderCell={(campaign: StoredDocument<NewsletterCampaign>, column: string) => {
            switch(column) {
                case 'title':
                    return (
                        <Link href={`/admin/newsletter/${campaign.id}`}>
                            {campaign.title}
                        </Link>
                    );
                case 'status':
                    return <Badge>{campaign.status}</Badge>;
                default:
                    return campaign[column as keyof NewsletterCampaign];
            }
          }}
        />
      </div>
    </div>
  );
};

export default NewsletterPage;
