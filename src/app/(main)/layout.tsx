import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Header";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";


// মেটাডেটা সাধারণত মেইন লেআউটে থাকলেই ভালো, তবে এখানেও রাখতে পারেন যদি পেজ স্পেসিফিক হয়
export const metadata = {
  title: "Your Site Title",
  description: "Your Site Description",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar সেশন পাস করছেন */}
      <Navbar session={session} />
      
      {/* মেইন কন্টেন্ট */}
      <main className="grow">
        {children}
      </main>

      {/* ফুটার */}
      <Footer />
    </div>
  );
}