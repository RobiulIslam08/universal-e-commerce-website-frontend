"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WhyChooseUs from "@/components/home/WhyChooseUs";

const TeamMember = ({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardContent className="p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <h3 className="font-semibold text-lg">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Harvey Spector",
      role: "Founder - CEO",
      image: "/images/image.png",
    },
    {
      name: "Jessica Pearson",
      role: "COO",
      image: "/images/image.png",
    },
    {
      name: "Rachel Zain",
      role: "Marketing Head",
      image: "/images/image.png",
    },
    {
      name: "Luise Litt",
      role: "Lead Developer",
      image: "/images/image.png",
    },
    {
      name: "Katrina Bennett",
      role: "Intern Designer",
      image: "/images/image.png",
    },
    {
      name: "Mike Ross",
      role: "Intern Designer",
      image: "/images/image.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2021/05/banner-04.jpg"
            alt="About Us Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Overlay Text */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl opacity-90">
              Building amazing products with passion and innovation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* About Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Our Universel journey began with a simple goal— to create an
                easy, safe, and reliable online shopping experience for our
                customers. With a team skilled in technology, design, and
                innovation, we are constantly moving forward with new ideas and
                a commitment to quality.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We believe that customer satisfaction is our greatest
                achievement. That’s why we put the utmost care into every order,
                every product, and every service. With your trust and support,
                we aim to go even further.
              </p>
              <Link href="/contact">
                <Button className="gap-2">
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/team-image.jpg"
                alt="Our Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description:
                  "We constantly push boundaries and explore new possibilities to stay ahead.",
              },
              {
                title: "Quality",
                description:
                  "Excellence is not an option. We strive for perfection in everything we do.",
              },
              {
                title: "Integrity",
                description:
                  "We believe in transparency and honest communication with our clients.",
              },
            ].map((value) => (
              <Card
                key={value.title}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </section>
        <WhyChooseUs/>
      </main>
    </div>
  );
}
