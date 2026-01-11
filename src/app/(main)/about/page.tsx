// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import WhyChooseUs from "@/components/home/WhyChooseUs";

// const TeamMember = ({
//   name,
//   role,
//   image,
// }: {
//   name: string;
//   role: string;
//   image: string;
// }) => (
//   <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//     <CardContent className="p-6 text-center">
//       <div className="mb-4 flex justify-center">
//         <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
//           <Image
//             src={image || "/placeholder.svg"}
//             alt={name}
//             fill
//             className="object-cover"
//           />
//         </div>
//       </div>
//       <h3 className="font-semibold text-lg">{name}</h3>
//       <p className="text-sm text-muted-foreground">{role}</p>
//     </CardContent>
//   </Card>
// );

// export default function AboutPage() {
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const teamMembers = [
//     {
//       name: "Harvey Spector",
//       role: "Founder - CEO",
//       image: "/images/image.png",
//     },
//     {
//       name: "Jessica Pearson",
//       role: "COO",
//       image: "/images/image.png",
//     },
//     {
//       name: "Rachel Zain",
//       role: "Marketing Head",
//       image: "/images/image.png",
//     },
//     {
//       name: "Luise Litt",
//       role: "Lead Developer",
//       image: "/images/image.png",
//     },
//     {
//       name: "Katrina Bennett",
//       role: "Intern Designer",
//       image: "/images/image.png",
//     },
//     {
//       name: "Mike Ross",
//       role: "Intern Designer",
//       image: "/images/image.png",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="relative h-96 overflow-hidden">
//         <div
//           className="absolute inset-0 transition-transform duration-300 ease-out"
//           style={{
//             transform: `translateY(${scrollY * 0.5}px)`,
//           }}
//         >
//           <Image
//             src="https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2021/05/banner-04.jpg"
//             alt="About Us Banner"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-black/40" />
//         </div>

//         {/* Overlay Text */}
//         <div className="relative z-10 h-full flex items-center justify-center">
//           <div className="text-center text-white">
//             <h1 className="text-5xl font-bold mb-4">About Us</h1>
//             <p className="text-xl opacity-90">
//               Building amazing products with passion and innovation
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-16">
//         {/* About Section */}
//         <section className="mb-20">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-4xl font-bold mb-6">Our Story</h2>
//               <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
//                 Our Universel journey began with a simple goal— to create an
//                 easy, safe, and reliable online shopping experience for our
//                 customers. With a team skilled in technology, design, and
//                 innovation, we are constantly moving forward with new ideas and
//                 a commitment to quality.
//               </p>
//               <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
//                 We believe that customer satisfaction is our greatest
//                 achievement. That’s why we put the utmost care into every order,
//                 every product, and every service. With your trust and support,
//                 we aim to go even further.
//               </p>
//               <Link href="/contact">
//                 <Button className="gap-2">
//                   Get in Touch
//                   <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </Link>
//             </div>
//             <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
//               <Image
//                 src="/team-image2.jpg"
//                 alt="Our Team"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Values Section */}
//         <section className="mb-20">
//           <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Innovation",
//                 description:
//                   "We constantly push boundaries and explore new possibilities to stay ahead.",
//               },
//               {
//                 title: "Quality",
//                 description:
//                   "Excellence is not an option. We strive for perfection in everything we do.",
//               },
//               {
//                 title: "Integrity",
//                 description:
//                   "We believe in transparency and honest communication with our clients.",
//               },
//             ].map((value) => (
//               <Card
//                 key={value.title}
//                 className="border-2 hover:border-primary/50 transition-colors"
//               >
//                 <CardContent className="p-8">
//                   <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">
//                     {value.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Team Section */}
//         <section>
//           <h2 className="text-4xl font-bold mb-12 text-center">
//             Meet Our Team
//           </h2>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {teamMembers.map((member) => (
//               <TeamMember key={member.name} {...member} />
//             ))}
//           </div>
//         </section>
//         <WhyChooseUs/>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {  ShoppingBag, Truck, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WhyChooseUs from "@/components/home/WhyChooseUs";

// ১. টিম মেম্বার কম্পোনেন্টে সোশ্যাল মিডিয়া আইকন বা হোভার ইফেক্ট যোগ করা
const TeamMember = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <Card className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-0 text-center">
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover   transition-all duration-500"
        />
      </div>
      <div className="p-6 bg-card">
        <h3 className="font-bold text-xl mb-1">{name}</h3>
        <p className="text-primary font-medium text-sm uppercase tracking-wider">{role}</p>
      </div>
    </CardContent>
  </Card>
);

// ২. স্ট্যাটস সেকশন (ক্রেতাদের বিশ্বাস বাড়ানোর জন্য)
const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-6 bg-primary/5 rounded-2xl">
    <h4 className="text-4xl font-bold text-primary mb-2">{value}</h4>
    <p className="text-muted-foreground font-medium">{label}</p>
  </div>
);

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    { name: "Harvey Spector", role: "Founder - CEO", image: "https://i.ibb.co.com/bM5FqJnh/my-image-whitebackground.png" },
    { name: "Jessica Pearson", role: "COO", image: "https://i.ibb.co.com/bM5FqJnh/my-image-whitebackground.png" },
    { name: "Mike Ross", role: "Product Manager", image: "https://i.ibb.co.com/bM5FqJnh/my-image-whitebackground.png" },
    // ... আপনার বাকি মেম্বাররা
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2070" 
            alt="About Us Banner"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            We are <span className="text-primary">Universel</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Redefining the way you shop online through technology, transparency, and top-tier quality.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-20 relative z-20">
        
        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 bg-card p-4 rounded-3xl shadow-xl">
          <StatItem value="10K+" label="Happy Customers" />
          <StatItem value="500+" label="Premium Products" />
          <StatItem value="24/7" label="Active Support" />
          <StatItem value="99%" label="Positive Feedback" />
        </section>

        {/* Story Section */}
        <section className="mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full -z-10 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Crafting Seamless <br/>Shopping Experiences</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Started in 2024, **Universel** was born out of a desire to bridge the gap between quality and accessibility. We realized that online shopping in our region needed more trust and better curation.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 items-center">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><Truck className="w-5 h-5"/></div>
                  <p className="font-semibold">Express Delivery Nationwide</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><ShieldCheck className="w-5 h-5"/></div>
                  <p className="font-semibold">100% Secure Payment Gateways</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/">
                  <Button size="lg" className="rounded-full px-8 gap-2">
                    Shop Now <ShoppingBag className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                  Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-primary rounded-3xl rotate-3 group-hover:rotate-0 transition-transform duration-500" />
               <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                 <Image
                   src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974"
                   alt="Our Team Workspace"
                   fill
                   className="object-cover"
                 />
               </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us (Already built component) */}
        <div className="mb-32">
          <WhyChooseUs />
        </div>

        {/* Team Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Minds Behind Universel</h2>
            <p className="text-muted-foreground max-w-xl mx-auto italic">
              &quot;Individually, we are one drop. Together, we are an ocean of innovation.&quot;
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* Professional Trust Footer */}
        <section className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-20 text-center mb-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10"><Star size={200}/></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to experience the best?</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied shoppers who trust Universel for their daily needs.
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary" className="rounded-full px-12 py-7 text-lg font-bold hover:scale-105 transition-transform">
              Start Shopping Today
            </Button>
          </Link>
        </section>

      </main>
    </div>
  );
}