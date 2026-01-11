// "use client";

// import type React from "react";

// import { useState } from "react";
// import Image from "next/image";
// import { Mail, Phone, MapPin, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { toast } from "sonner";

// export default function ContactPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // আমাদের তৈরি করা API Route (/api/send) এ ডাটা পাঠানো হচ্ছে
//       const response = await fetch("/api/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           type: "contact_form", // এটি দিয়ে API চিনবে যে এটা কন্টাক্ট ফর্ম
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success("আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে!");
//         // ফর্ম ক্লিয়ার করা
//         setFormData({ name: "", email: "", subject: "", message: "" });
//       } else {
//         console.error("Email Error:", result.error);
//         toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
//       }
//     } catch (error) {
//       console.error("Submit Error:", error);
//       toast.error("সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const contactInfo = [
//     {
//       icon: Mail,
//       title: "Email",
//       value: "hello@example.com",
//       href: "mailto:hello@example.com",
//     },
//     {
//       icon: Phone,
//       title: "Phone",
//       value: "+1 (555) 123-4567",
//       href: "tel:+15551234567",
//     },
//     {
//       icon: MapPin,
//       title: "Address",
//       value: "123 Business St, City, State 12345",
//       href: "#",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="relative h-96 overflow-hidden">
//         <div className="absolute inset-0">
//           <Image
//             src="https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2019/12/banner-06.jpg"
//             alt="Contact Us Banner"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-black/40" />
//         </div>

//         {/* Overlay Text */}
//         <div className="relative z-10 h-full flex items-center justify-center">
//           <div className="text-center text-white">
//             <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
//             <p className="text-xl opacity-90">
//               We&apos;d love to hear from you
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-16">
//         <div className="grid lg:grid-cols-3 gap-8 mb-16">
//           {/* Contact Info Cards */}
//           {contactInfo.map(({ icon: Icon, title, value, href }) => (
//             <Card key={title} className="hover:shadow-lg transition-shadow">
//               <CardContent className="p-8 text-center">
//                 <div className="mb-4 flex justify-center">
//                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Icon className="w-6 h-6 text-primary" />
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">{title}</h3>
//                 <a
//                   href={href}
//                   className="text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   {value}
//                 </a>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Contact Form Section */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start">
//           {/* Left Side - Text Content */}
//           <div className="space-y-6">
//             <h2 className="text-4xl font-bold">Don&apos;t be a stranger!</h2>
//             <h3 className="text-2xl font-semibold text-primary">
//               You tell us. We listen.
//             </h3>
//             <p className="text-muted-foreground leading-relaxed">
//               Cras elementum finibus lacus nec lacinia. Quisque non convallis
//               nisl, eu condimentum sem. Proin dignissim libero lacus, ut
//               eleifend magna vehicula et. Nam mattis est sed tellus.
//             </p>
//           </div>

//           {/* Right Side - Form */}
//           <div className="bg-white border p-4 shadow">
//             <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   placeholder="Your name"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   placeholder="your@email.com"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="subject"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   id="subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   placeholder="How can we help?"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="message"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   required
//                   rows={5}
//                   className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
//                   placeholder="Your message here..."
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full gap-2"
//               >
//                 {isSubmitting ? "Sending..." : "Send Message"}
//                 <Send className="w-4 h-4" />
//               </Button>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "contact_form" }),
      });
      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* --- Dynamic Hero Header --- */}
      <div className="relative h-[450px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2019/12/banner-06.jpg"
          alt="Contact Header"
          fill
          className="object-cover opacity-60 scale-105 transition-transform duration-10000 hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
        
        <div className="relative z-10 text-center space-y-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md text-primary-foreground text-xs font-bold tracking-widest uppercase">
            <Globe className="w-3 h-3" /> Get in Touch
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
            Connect With Us
          </h1>
          <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Have a question or just want to say hi? We&apos;d love to hear from you. 
            Our team usually responds within 2 hours.
          </p>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <main className="container mx-auto px-4 -mt-24 relative z-20 pb-24">
        
        {/* Contact Quick Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Mail, label: "Email Us", val: "hello@universel.com", color: "bg-blue-500" },
            { icon: Phone, label: "Call Us", val: "+1 (555) 000-1234", color: "bg-rose-500" },
            { icon: MapPin, label: "Visit Us", val: "123 Business St, NY", color: "bg-amber-500" }
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-2xl shadow-slate-200 dark:shadow-none hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-2xl ${item.color} text-white shadow-lg`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</h3>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{item.val}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                DON&apos;T BE A <br />
                <span className="text-primary underline decoration-slate-300 underline-offset-8">STRANGER!</span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-5 items-start p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><MessageSquare /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Live Chat Support</h4>
                  <p className="text-slate-500 text-sm">Available Mon-Sat, 9am - 10pm</p>
                </div>
              </div>
              <div className="flex gap-5 items-start p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Clock /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Response Time</h4>
                  <p className="text-slate-500 text-sm">We typically respond within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7">
            <Card className="border-none shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-8 md:p-14">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Full Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="relative group">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Subject</label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="relative group">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 dark:bg-slate-800 dark:border-slate-800 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-8 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        Send Message <Send className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}