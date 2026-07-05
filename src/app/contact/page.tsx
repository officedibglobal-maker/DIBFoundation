
import { getSitePageBySlug } from "@/lib/firebase/firestore/getSitePageBySlug";
import { SitePageRenderer } from "@/components/site/SitePageRenderer";
import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: NextPage = async () => {
  const page = await getSitePageBySlug("contact");

  if (page && page.status === "published") {
    return <SitePageRenderer page={page} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          We would love to hear from you. Whether you have a question, a comment, or a proposal, please don’t hesitate to get in touch.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
          <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                   <Input placeholder="First Name" />
                   <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email Address" />
               <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Reason for contacting us" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                  <SelectItem value="partnerships">Partnerships</SelectItem>
                  <SelectItem value="volunteering">Volunteering</SelectItem>
                   <SelectItem value="careers">Careers</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Textarea placeholder="Your Message" rows={6}/>
              <Button type="submit" size="lg">Send Message</Button>
          </form>
        </div>
         <div>
          <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-4">
              <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-3 mt-1"/>
                  <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-slate-700">info@doctorsinbusiness.com</p>
                  </div>
              </div>
               <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-3 mt-1"/>
                  <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-slate-700">(+1) 123-456-7890</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-3 mt-1"/>
                  <div>
                      <h3 className="font-semibold">Mailing Address</h3>
                      <p className="text-slate-700">123 Giving Lane, Toronto, ON, Canada</p>
                  </div>
              </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactPage;
