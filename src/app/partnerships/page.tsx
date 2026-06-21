
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnershipProposalTool } from '@/components/ai/PartnershipProposalTool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, School, GraduationCap, Handshake, ShieldCheck, HeartPulse } from 'lucide-react';

export default function PartnershipsPage() {
  const models = [
    {
      title: "Corporate CSR Partnerships",
      icon: Building2,
      desc: "Align your brand with health equity and youth empowerment through measurable social impact initiatives."
    },
    {
      title: "University Collaborations",
      icon: School,
      desc: "Partner with our African Field School for student exchange programs, research hubs, and global health internships."
    },
    {
      title: "Development & Research",
      icon: GraduationCap,
      desc: "Collaborate on evidence-based public health studies that inform humanitarian interventions across Africa."
    },
    {
      title: "Philanthropic Foundations",
      icon: ShieldCheck,
      desc: "Deploy large-scale funding through our community-vetted, high-accountability clinical hubs and school projects."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Partnerships for Global Change</h1>
            <p className="text-xl text-white/70 leading-relaxed">
              DIBF thrives on the power of collective wisdom and shared resources. 
              Together, we create sustainable pathways for dignity, health, and development.
            </p>
          </div>
        </div>
        <div className="absolute -right-20 top-0 w-96 h-96 bg-primary/20 blur-3xl rounded-full" />
      </section>

      {/* Partnership Models */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="How We Collaborate" 
            subtitle="We offer diverse engagement models tailored to the strengths of our institutional and individual partners."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {models.map((item, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-headline font-bold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tool Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Accelerate Your Collaboration</h2>
            <p className="text-lg text-muted-foreground">
              Use our AI-powered Partnership Assistant to generate a draft proposal highlighting 
              how your organization's mission aligns with DIBF's focus areas.
            </p>
          </div>
          <PartnershipProposalTool />
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <SectionHeader 
                  title="The DIBF Advantage" 
                  subtitle="Why leading institutions choose DIBF as their African social impact partner."
                />
                <div className="space-y-6">
                  {[
                    "Accountability: Rigorous reporting and impact measurement on every project.",
                    "Expertise: Led by medical professionals with deep business acumen.",
                    "Sustainability: Focus on local leadership and long-term community ownership.",
                    "Visibility: Premium recognition for partners through our global network."
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <p className="text-secondary/80 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
             </div>
             <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center">
                    <Handshake className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-secondary">Ready to start the conversation?</h3>
                  <p className="text-muted-foreground">Our partnerships team is ready to discuss how we can build something impactful together.</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Card className="flex-1 p-4 flex flex-col items-center gap-2">
                       <p className="text-xs text-muted-foreground uppercase tracking-widest">Email Us</p>
                       <p className="font-bold text-primary">partners@dibf.org</p>
                    </Card>
                    <Card className="flex-1 p-4 flex flex-col items-center gap-2">
                       <p className="text-xs text-muted-foreground uppercase tracking-widest">Direct Line</p>
                       <p className="font-bold text-primary">+1 (555) 000-0000</p>
                    </Card>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
