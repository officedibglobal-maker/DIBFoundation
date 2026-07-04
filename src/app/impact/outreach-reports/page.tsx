'use client';

import { NextPage } from 'next';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const reports = [
    {
        title: "Annual Report 2023",
        description: "An overview of our activities, accomplishments, and financial performance in 2023.",
        link: "/reports/annual-report-2023.pdf"
    },
    {
        title: "Medical Outreach Report - Q3 2023",
        description: "Detailed report on our medical outreach activities in the third quarter of 2023.",
        link: "/reports/medical-outreach-q3-2023.pdf"
    },
    {
        title: "Community Health Initiative Impact Assessment",
        description: "An assessment of the impact of our community health initiatives over the past two years.",
        link: "/reports/community-health-impact-assessment.pdf"
    }
]

const OutreachReportsPage: NextPage = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <FileText className="mx-auto h-12 w-12 text-primary"/>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-4">
        Outreach Reports & Publications
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
        Transparency and accountability are core to our work. Here you will find our reports and publications, which detail our activities, findings, and the impact of our initiatives.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
        {reports.map(report => (
            <div key={report.title} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
                <h2 className="text-xl font-bold mb-2">{report.title}</h2>
                <p className="text-slate-700 flex-grow">{report.description}</p>
                <Button variant="outline" asChild className="mt-4 self-start">
                    <a href={report.link} target="_blank" rel="noopener noreferrer">Download PDF <Download className="ml-2 h-4 w-4"/></a>
                </Button>
            </div>
        ))}
    </div>

    <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Further Reading</h2>
         <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/publications">View All Publications</Link>
            </Button>
        </div>
    </div>

  </div>
);

export default OutreachReportsPage;
